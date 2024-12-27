import createMessageAndRun from '@/actions/openai-create-message-and-run'
import prisma from '@/prisma'

export default async function(message: any) {
  await prisma.message.update({ where: { id: message.id }, data: { locked: true } })

  const outboundMessage = await createMessageAndRun({
    openai_key: message.assistant.openai_key,
    threadId: message.thread.threadId,
    assistantId: message.assistant.assistantId,
    receivedMessage: message.receivedMessage,
    alias: message.assistant.alias,
    fromEmail: message.fromEmail,
    toEmails: message.toEmails,
    ccEmails: message.ccEmails,
    bccEmails: message.bccEmails,
    subject: message.subject,
    fileIds: message.fileIds
  }) 

  if (process.env.PRISMA_ON === "0") {
    return { ...message, outboundMessage }
  }

  const updatedMessage = await prisma.message.update({ 
    where: { id: message.id }, 
    data: { outboundMessage, locked: false }
  })

  return updatedMessage
}