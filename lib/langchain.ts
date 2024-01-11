import { ConversationalRetrievalQAChain } from "langchain/chains";
import { getVectorStore } from "./vector-store";
import { getPineconeClient } from "./pinecone-client";
import {
  StreamingTextResponse,
  experimental_StreamData,
  LangChainStream,
} from "ai-stream-experimental";
import { streamingModel, nonStreamingModel } from "./llm";
import { STANDALONE_QUESTION_TEMPLATE, QA_TEMPLATE } from "./prompt-templates";

type callChainArgs = {
  question: string;
  chatHistory: string;
};

export async function callChain({ question, chatHistory }: callChainArgs) {
    try {
        
      // Check if question and chatHistory are defined and not null
      if (question == null || chatHistory == null) {
        throw new Error("Invalid input: question or chatHistory is null or undefined");
      }
  
      console.log("Received question:", question);
      console.log("Received chatHistory:", chatHistory);
  
      const sanitizedQuestion = question.trim().replaceAll("\n", " ");
      console.log("Sanitized question:", sanitizedQuestion);
  
      const pineconeClient = await getPineconeClient();
  
      const vectorStore = await getVectorStore(pineconeClient as any);
  
      const { stream, handlers } = LangChainStream({
        experimental_streamData: true,
      });
      const data = new experimental_StreamData();
      const chain = ConversationalRetrievalQAChain.fromLLM(
        streamingModel,
        vectorStore.asRetriever(),
        {
          qaTemplate: QA_TEMPLATE,
          questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
          returnSourceDocuments: true,
          questionGeneratorChainOptions: {
            llm: nonStreamingModel,
          },
        }
      );

      chain.call(
        {
          question: sanitizedQuestion,
          chat_history: chatHistory,
        },
        [handlers]
      ).then(async (res) => {
        const sourceDocuments = res?.sourceDocuments;
        const firstTwoDocuments = sourceDocuments.slice(0, 2);
        const pageContents = firstTwoDocuments.map(
          ({ pageContent }: { pageContent: string }) => pageContent
        );
        console.log("already appended ", data);
        data.append({
          sources: pageContents,
        });
        data.close();
      });
  
        return new StreamingTextResponse(stream, {}, data);
      } catch (e) {
        console.error(e);
        throw new Error("Call chain method failed to execute successfully!!");
      }
    }
