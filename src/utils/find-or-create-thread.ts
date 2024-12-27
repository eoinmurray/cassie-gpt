import createThread from "@/actions/openai-create-thread"
import prisma from "@/prisma"
import parseCleanSubject from "@/utils/parse-clean-subject"

export default async function (messageId: string, subject: string, assistant: any, user: any): Promise<any> {
  const cleanedSubject = parseCleanSubject(subject)

  let thread = await prisma.thread.findFirst({ where: { assistantId: assistant.id, alias: cleanedSubject, } })
  if (thread) { return thread.id }

  if (!thread && user) {
    const openaiThreadId =  await createThread(assistant.openai_key)
    thread = await prisma.thread.create({
      data: {
        userId: user.id,
        assistantId: assistant.id,
        alias: cleanedSubject,
        threadId: openaiThreadId,
        createdAt: new Date(),
      }
    })
  }

  if (!thread) {
    throw new Error(`Could not find or create thread for message ${messageId}`)
  }

  return thread.id
}