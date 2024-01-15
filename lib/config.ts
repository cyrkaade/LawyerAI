import z from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().trim().min(1),
  PINECONE_API_KEY: z.string().trim().min(1),
  PINECONE_ENVIRONMENT: z.string().trim().min(1),
  PINECONE_INDEX_NAME: z.string().trim().min(1),
  PDF_PATH: z.string().trim().min(1),
  INDEX_INIT_TIMEOUT: z.coerce.number().min(1),
  KV_URL: z.string().trim().min(1),
  KV_REST_API_URL: z.string().trim().min(1),
  KV_REST_API_TOKEN: z.string().trim().min(1),
  KV_REST_API_READ_ONLY_TOKEN: z.string().trim().min(1),
  AUTH_SECRET: z.string().trim().min(1),
  AUTH_GITHUB_ID: z.string().trim().min(1),
  AUTH_GITHUB_SECRET: z.string().trim().min(1),
  NEXTAUTH_URL: z.string().trim().min(1),

});

export const env = envSchema.parse(process.env);
