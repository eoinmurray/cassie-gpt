import OpenAI from "openai"
import { internet_search } from "@/actions/llm_tools"
import { tools } from "@/actions/llm_tools"

const _tools: any[] = tools.map(tool => {
  return {
    type: "function",
    function: tool.definition
  }
})

_tools.push({ type: "code_interpreter" })
_tools.push({ type: "file_search" })

export default async function createAssistant({
  openai_key,
  instructions= "You are a personal assistant. When asked a question, answer quickly as a personal assistant or secretary would.",
  name= "Email Assistant",
  model = "gpt-4o",
}: {
  openai_key: string,
  instructions: string,
  name: string,
  model: string
}): Promise<string>{
  if (process.env.OPENAI_ON === "0") return 'OPENAI_ON===0'
  const openai = new OpenAI({ apiKey: openai_key })
  const { id } = await openai.beta.assistants.create({
    instructions,
    name,
    tools: _tools,
    model
  })
  return id
}
