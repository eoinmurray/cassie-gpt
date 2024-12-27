import { Prisma } from "@prisma/client";
import prisma from "@/prisma";
import parseCleanSubject from "@/utils/parse-clean-subject";


export default async function isInExistingThread (message: Prisma.MessageCreateInput): Promise<any> {
  let thread = await prisma.thread.findFirst({ 
    where: { 
      alias: parseCleanSubject(message.subject), 
    }
  })

  return thread
}