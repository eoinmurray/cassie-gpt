"use server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/prisma";

export const deleteAssistant = async (id: string, userId: string) => {
  await prisma.assistant.delete({ where: { id, userId }})
}

export default async function (id: any) {
  const session = await auth()
  if (!session?.user || !session.user.id) {
    return { message: "Not authenticated" }
  }
  
  await deleteAssistant(id, session.user.id)
  redirect("/")
}