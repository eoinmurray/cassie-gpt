// import { logging } from "@/utils/logging"

export default async function ({
  receivedMessage, 
  // alias, 
  // fromEmail, 
  // toEmails, 
  // ccEmails, 
  // bccEmails, 
  // subject, 
  fileIds
}: {
  receivedMessage: string, 
  alias: string, 
  fromEmail: string, 
  toEmails: string, 
  ccEmails?: string, 
  bccEmails?: string, 
  subject: string, 
  fileIds?: string[]
}): Promise<any[]> {
  const userMessage = {
    role: 'user', 
    content: receivedMessage,
    attachments: fileIds?.map((id: string) => ({
      file_id: id, 
      tools: [{ type: "file_search" }] 
    }))
  }

  // const systemMessage = {
  //   role: 'assistant', 
  //   content: `
  //     My email address is ${alias}@${process.env.NEXT_PUBLIC_DOMAIN}.

  //     My next message was sent to the following
  //     from: ${fromEmail}
  //     to: ${toEmails}
  //     cc: ${ccEmails}
  //     bcc: ${bccEmails}
  //     subject: ${subject}

  //     Answer it as if you were you.
  //   `,
  // }

  return [
    // systemMessage, 
    userMessage
  ]
}