import OpenAI from 'openai'
import { logging } from "@/utils/logging"
import { EventEmitter } from 'node:events';
import { internet_search, tools } from '@/actions/llm_tools';

export default async function createMessageAndRun(
  { openai_key, assistantId, receivedMessage,threadId, alias, fromEmail, toEmails, ccEmails, bccEmails, subject, fileIds }: 
  { openai_key: string, assistantId: string, receivedMessage: string, threadId: string,alias: string, fromEmail: string, toEmails: string, ccEmails?: string, bccEmails?: string, subject: string, fileIds?: string[] }
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    if (process.env.OPENAI_ON === "0") {
      logging.log({ runOutput: 'OPENAI_ON===0' })
      return 'OPENAI_ON===0'
    }

    const openai = new OpenAI({ apiKey: openai_key })
    const userMessage: { role: "user", content: string, attachments?: any[] } = {
      role: "user", 
      content: receivedMessage,
      attachments: fileIds?.map((id: string) => ({
        file_id: id, 
        tools: [{ type: "file_search" }] 
      }))
    }

    const systemMessage: { role: "assistant", content: string } = {
      role: "assistant", 
      content: `Today is ${new Date().toDateString()}`,
    }

    openai.beta.threads.messages.create(threadId, systemMessage);
    openai.beta.threads.messages.create(threadId, userMessage);
    const stream = await openai.beta.threads.runs.stream(threadId, { assistant_id: assistantId });

    let runOutput = ''
    const emitter = new EventEmitter();
    emitter.on("thread.message.delta", (event) => {
      if (event.event === "thread.message.delta") {
        runOutput += event.data.delta.content[0].text.value
      }
    });

    emitter.on("thread.run.requires_action", async (event) => {
      const toolCalls = event.data.required_action?.submit_tool_outputs.tool_calls
      const toolOutputs = await Promise.all(
        toolCalls?.map(async (toolCall: any) => {
          const tool = tools.find(tool => tool.definition.name === toolCall.function.name)
          if (!tool) {
            logging.log(`tool ${toolCall.function.name} not found`)
            return 'tool not found'
          }

          const output = await tool.implementation(toolCall.function.arguments)
          return { tool_call_id: toolCall.id, output };
        })
      )

      if (toolOutputs && toolOutputs.length > 0) {
        const toolStream = openai.beta.threads.runs.submitToolOutputsStream(
          threadId,
          event.data.id,
          { tool_outputs: toolOutputs }
        );
        for await (const event of toolStream) {
          logging.log(`posttool ${event.event}`)
          emitter.emit(event.event, event);
        }
      }
    })

    emitter.on("thread.run.completed", async (event) => {
      resolve(runOutput)
    })

    for await (const event of stream) {
      logging.log(event.event)
      emitter.emit(event.event, event);
    }
  })
}

