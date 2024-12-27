import { logging } from "@/utils/logging"
import OpenAI from "openai"

if (process.env.OPENAI_ON === "0") {
  logging.log('OPENAI_ON===0')
  process.exit(0)
}
const openai = new OpenAI({ apiKey: process.env.TEST_OPENAI_API_KEY })

const assistants = await openai.beta.assistants.list({ limit: 100 })
for (const assistant of assistants.data) {
  await openai.beta.assistants.del(assistant.id)
  logging.log(`Deleted assistant ${assistant.id}`)
}

const files = await openai.files.list()
for (const file of files.data) {
  await openai.files.del(file.id)
  logging.log(`Deleted file ${file.id}`)
}

const vectorStores = await openai.beta.vectorStores.list()
for (const vectorStore of vectorStores.data) {
  await openai.beta.vectorStores.del(vectorStore.id)
  logging.log(`Deleted vectorStore ${vectorStore.id}`)
}