import handleGenerateAiReponse from '@/actions/system-generate-ai-response';
import prisma from "@/prisma";

export default async function() {
  const messages = await prisma.message.findMany({
    where: {
      outboundMessage: null,
      sentAt: null,
      assistantId: { not: null },
      threadId: { not: null },
      locked: false
    },
    include: {
      assistant: true,
      thread: true,
    }
  });

  for (const message of messages) { 
    await handleGenerateAiReponse(message) 
  }

  return messages
}