import { logging } from "@/utils/logging"
import OpenAI from "openai"
import minimist from 'minimist';
import prisma from "@/prisma";

if (process.env.OPENAI_ON === "0") {
  logging.log('OPENAI_ON===0')
  process.exit(0)
}
const openai = new OpenAI({ apiKey: process.env.TEST_OPENAI_API_KEY })

const argv = minimist(process.argv.slice(2))
const alias = argv.thread

const thread = await prisma.thread.findFirst({
  where: {
    alias,
  },
})

if (!thread) {
  throw new Error(`Thread not found: ${alias}`)
}

const threadMessages = await openai.beta.threads.messages.list(
  thread.threadId,
);

for (const message of threadMessages.data.reverse()) {
  logging.log(`===========================`)
  // logging.log(`${message.role}:`)
  // logging.log('\n')
  // logging.log(message.content[0].text.value)
  logging.log(message)
}
logging.log(`===========================`)