import uploadAttachment from "@/actions/openai-upload-attachement";
import { IncomingCloudflareEmail } from "@/types/incoming-cloudflare-email";

export default async function (email: IncomingCloudflareEmail, openai_key: string): Promise<string[]> {
  const fileIds: string[] = []
  if (!email.attachments) return fileIds
  for (const attachment of email.attachments) {
    const fileId = await uploadAttachment({
      filename: attachment.filename, 
      content: attachment.content, 
      openai_key
    })
    if (fileId) fileIds.push(fileId)
  }

  return fileIds
}