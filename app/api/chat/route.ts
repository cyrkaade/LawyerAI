import { callChain } from '@/lib/langchain'; 
import { auth } from '@/auth';
import { getSession } from 'next-auth/react';
import { kv } from '@vercel/kv';
import { nanoid } from '@/lib/utils';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
      const json = await req.json();
      const { messages, previewToken } = json;
      
      const userId = (await auth())?.user.id;

      if (!userId) {
          return new Response('Unauthorized', {
              status: 401,
          });
      }

      // Extracting the last message as the question
      const lastMessage = messages[messages.length - 1];
      console.log('last message = ', lastMessage)
      const question = lastMessage?.content;
      //@ts-ignore
      const chatHistory = messages.slice(0).map(message => message.content).join('\n');
      console.log('hist:', chatHistory)
      const streamingResponse = await callChain({ question, chatHistory });
      
      console.log('streaming response = ', streamingResponse)
        const title = messages[0]?.content.substring(0, 100);
        const id = json.id ?? nanoid();
        const createdAt = Date.now();
        const path = `/chat/${id}`;
        const payload = {
          id,
          title,
          userId,
          createdAt,
          path,
          messages: [
            ...messages,
            {
              content: streamingResponse,
              role: 'assistant'
            }
          ]
        };
    
        // Store in KV
        await kv.hmset(`chat:${id}`, payload);
        await kv.zadd(`user:chat:${userId}`, {
          score: createdAt,
          member: `chat:${id}`
        });
      return streamingResponse;
  } catch (e) {
      console.error(e);
      return new Response('Error processing the request', { status: 500 });
  }
}

