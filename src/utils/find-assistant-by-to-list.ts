import prisma from "@/prisma"
import { logging } from "./logging"

export default async function findAssistantByToList (address: string) {
  const addresses = address.split(',')
  const first = addresses.find(a => {
    return a.includes(`@${process.env.NEXT_PUBLIC_DOMAIN}`) || a.includes(`@${process.env.MAIN_EMAIL_DOMAIN}`)
  })

  logging.log({ first }, 3)
  
  const assistant = await prisma.assistant.findFirst({ 
    where: { 
      alias: first?.split('@')[0]?.trim()
    },
    select: {
      id: true,
      openai_key: true,
      alias: true,
      user: true,
      assistantId: true,
    },
  })

  logging.log({ assistant }, 3)

  if (!assistant) throw new Error(`Assistant not found for alias ${first}`)
  
  return assistant
}