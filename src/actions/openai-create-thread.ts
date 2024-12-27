import OpenAI from "openai"

export default async function createThread(openai_key: string): Promise<string>{
  if (process.env.OPENAI_ON === "0") return 'OPENAI_ON===0'
  const openai = new OpenAI({ apiKey: openai_key })
  const { id } = await openai.beta.threads.create()
  return id
}