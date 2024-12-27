import handleSendResponse from '@/actions/system-send-response';
import prisma from '@/prisma';

export default async function main () {
  const messages = await prisma.message.findMany({
    where: {
      NOT: { outboundMessage: null },
      sentAt: null,
      locked: false,
    },
    include: {
      thread: {
        include: {
          assistant: true
        }
      }
    }
  });

  const newMessages = []
  for (const message of messages) { 
    try {
      const updatedMessage = await handleSendResponse(message)
      newMessages.push(updatedMessage)
    } catch (error) {
      console.error(error)
    }
  }
  
  return newMessages
}