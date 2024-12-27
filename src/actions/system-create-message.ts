import 'dotenv/config'
import prisma from '@/prisma'
import { Prisma } from '@prisma/client'
import findAssistantByToList from '@/utils/find-assistant-by-to-list'
import findOrCreateThread from '@/utils/find-or-create-thread'
import uploadAttachmentsFromEmail from '@/utils/upload-attachments-from-email'
import { logging } from '@/utils/logging'
import omit from '@/utils/omit'
import cloudflareIncomingToPrismaMessageCreate from '@/types/cloudflare-to-prisma'
import PostalMime from 'postal-mime'
import { IncomingCloudflareEmail } from '@/types/incoming-cloudflare-email'
import proof from '@/utils/proof'

export default async function createMessage (raw: Blob): Promise<any> {
  const rawText = await raw.text()
  const email = await PostalMime.parse(rawText) as IncomingCloudflareEmail;

  logging.log(rawText, 3)
  logging.log(email, 3)

  if (process.env.PROOF === "1") {
    await proof(await raw.text(), email.messageId)
  }

  const messageCreatePayload: Prisma.MessageCreateInput = cloudflareIncomingToPrismaMessageCreate(email)

  if (process.env.PRISMA_ON === "0") {
    const fakeMessage = {
      ...messageCreatePayload,
      id: 'fake-id',
      userId: 'u1',
      assistant: {
        assistantId: process.env.TEST_ASSISTANT_ID,
        openai_key: process.env.TEST_OPENAI_API_KEY
      },
      threadId: 't1',
      fileIds: []
    }

    return fakeMessage
  }

  const message = await prisma.message.create({ data: messageCreatePayload })
  const assistant = await findAssistantByToList(message.toEmails)
  const userId = assistant.user.id
  
  const threadId = await findOrCreateThread(message.id, message.subject, assistant, userId)
  const fileIds = await uploadAttachmentsFromEmail(email, assistant.openai_key)
  const updatePayload: Prisma.MessageUpdateInput = { 
    id: message.id,
    user: { connect: { id: userId } },
    assistant: { connect: { id: assistant.id } },
    thread: { connect: { id: threadId } },
    fileIds
  }

  const updatedMessage = await prisma.message.update({ 
    where: { 
      id: updatePayload.id as string 
    }, 
    data: updatePayload,
    include: {
      user: true,
      assistant: true,
      thread: true
    }
  })

  logging.log({ createMessage: omit(updatedMessage, ['headers', 'thread', 'assistant', 'user']) }, 2)
  return updatedMessage
}