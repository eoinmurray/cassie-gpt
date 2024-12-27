
import { OpenAI } from "openai"
import { getMimeType } from "@/utils/mimetypes"

export default async function uploadAttachment({ filename, content, openai_key }: {filename: string, content: ArrayBuffer | Buffer, openai_key: string }) {
  if (process.env.OPENAI_ON === "0") return 'OPENAI_ON===0'
  const openai = new OpenAI({ apiKey: openai_key })
  const mimetype = getMimeType(filename)
  const attachmentFile = new File([content], filename, { type: mimetype }) 
  const file = await openai.files.create({ file: attachmentFile, purpose: 'assistants' })
  await openai.files.create({ file: attachmentFile, purpose: 'fine-tune' })

  return file.id
}