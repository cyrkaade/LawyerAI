import { callChain } from '@/lib/langchain'; 
import { auth } from '@/auth';

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
      const question = lastMessage?.content;
      //@ts-ignore
      const chatHistory = messages.slice(0, -1).map(message => message.content).join('\n');
      console.log('hist:', chatHistory)
      const streamingResponse = await callChain({ question, chatHistory });

      return streamingResponse;
  } catch (e) {
      console.error(e);
      return new Response('Error processing the request', { status: 500 });
  }
}

