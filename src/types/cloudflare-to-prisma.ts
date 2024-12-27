import { Prisma } from "@prisma/client"
import parseCleanSubject from "@/utils/parse-clean-subject"
import { IncomingCloudflareEmail } from "@/types/incoming-cloudflare-email"

export default function cloudflareIncomingToPrismaMessageCreate(email: IncomingCloudflareEmail): Prisma.MessageCreateInput {
  let existingReferences: string[] = []

  const headers = email.headers.reduce((acc, header) => {
    acc[header.name] = header.value
    return acc
  } , {} as {[key: string]: string})

  if (headers['References']){
    existingReferences = headers['References']
  }

  let existingInReplyTo: string[] = []
  if (headers['In-Reply-To']){
    existingInReplyTo = headers['In-Reply-To']
  }

  const payload = {
    userId: undefined,
    threadId: undefined,
    assistantId: undefined,
    fileIds: [],
    messageId: email.messageId,
    existingInReplyTo,
    existingReferences,
    createdAt: new Date(email.date),
    sentAt: null,
    receivedMessage: email.text?.trim() || "",
    outboundMessage: null,
    fromEmail: email.from.address.trim(),
    headers: JSON.stringify(email.headers),
    toEmails: email.to.map((contact: any) => contact.address).join(", ").trim(),
    ccEmails: email.cc ? email.cc?.map((contact: any) => contact.address).join(", ").trim() : "", 
    bccEmails: email.bcc? email.bcc?.map((contact: any) => contact.address).join(", ").trim(): "", 
    replyToEmails: "",
    subject: email.subject.trim(),
    cleanedSubject: parseCleanSubject(email.subject).trim(),
  } as Prisma.MessageCreateInput

  return payload
}