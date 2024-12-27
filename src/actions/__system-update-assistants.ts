/**
 * 
 * DEPRECATED
 * 
 */

import prisma from "@/prisma"
import createAssistant from "@/actions/openai-create-assistant"
import { readFile, writeFile } from "fs/promises"

if (!process.env.TEST_OPENAI_API_KEY) throw new Error('TEST_OPENAI_API_KEY not found')
if (!process.env.NEXT_PUBLIC_DOMAIN) throw new Error('NEXT_PUBLIC_DOMAIN not found')
if (!process.env.MAIN_EMAIL_DOMAIN) throw new Error('MAIN_EMAIL_DOMAIN not found')
if (!process.env.ADMIN_EMAIL) throw new Error('ADMIN_EMAIL not found')
if (!process.env.ADMIN_BOT_NAME) throw new Error('ADMIN_BOT_NAME not found')
  
// const randomId = Math.random().toString(36).substring(7)
// const assistantName = `assistant-${randomId}`
const assistantName = `${process.env.ADMIN_BOT_NAME}`

const instructions = (await readFile('admin-prompt.txt')).toString()
  .replace('{NAME}', assistantName)
  .replace('{ADDRESS}', `${assistantName}@${process.env.MAIN_EMAIL_DOMAIN}`)

const id = await createAssistant({
  openai_key: process.env.TEST_OPENAI_API_KEY,
  instructions,
  name: assistantName,
  model: "gpt-4o"
})  

const user = await prisma.user.findFirst({ where: { email: process.env.ADMIN_EMAIL }})
if (!user) throw new Error('User not found')

const assistant = await prisma.assistant.create({ data: {
  userId: user.id,
  alias: assistantName,
  assistantId: id,
  openai_key: process.env.TEST_OPENAI_API_KEY
} })

if (!assistant) throw new Error('Assistant not created')
console.log({ assistant })

const dotenv = require('dotenv')
const config = dotenv.config()
const { parsed } = config
parsed.TEST_ASSISTANT_ID = id
parsed.TEST_BOT_NAME = assistantName
await writeFile('.env', Object.entries(parsed).map(([key, value]) => `${key}="${value}"`).join('\n'))