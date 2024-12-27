"use server"
import { redirect } from "next/navigation"
import prisma from "@/prisma"
import { auth } from "@/auth"

export const createAssistant = async ({
  userId,
  alias,
  assistantId,
  openai_key
}: {
  userId: string,
  alias: string,
  assistantId: string,
  openai_key: string
}) => {
  const payload = {
    userId: userId,
    alias: alias,
    assistantId: assistantId,
    openai_key: openai_key
  }
  
  return prisma.assistant.create({ data: payload })
}

export default async function ({ alias, assistantId, openai_key }: { alias: string, assistantId: string, openai_key: string }): Promise<any> {
  const session = await auth()

  if (!session?.user) {
    return { message: "Not authenticated" }
  }

  if (!session.user.id){
    return { message: "User has no id." }
  }

  try {
    await createAssistant({ userId: session.user.id, alias, assistantId, openai_key })
  } catch (error: any) {
    console.error(error)
    return { message: error.message }
  }

  redirect(`/`)
}