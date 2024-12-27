import createMessage from '@/actions/system-create-message';
import { IncomingCloudflareEmail } from '@/types/incoming-cloudflare-email';
import apiErrorHandling from '@/utils/api-error-handling';
import generateAiResponse from '@/actions/system-generate-ai-response';
import sendResponse from '@/actions/system-send-response';
import PostalMime from 'postal-mime';

export const revalidate = 0
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST (request: Request) {
  const raw = await request.blob()
  try {
    const message = await createMessage(raw)

    if (process.env.ONE_CALL === "1") {
      const generatedMessage = await generateAiResponse(message) 
      if (!generatedMessage.outboundMessage) {
        throw new Error('No outboundMessage')
      }
      const sentMessage = await sendResponse(generatedMessage)
      if (!sentMessage.sentAt) {
        throw new Error('No sentAt')
      }
    }

    if (process.env.SELF_CHAIN === "1") {
      await fetch(`https://${process.env.NEXT_PUBLIC_DOMAIN}/api/generate-ai-responses`)
    }

    return Response.json({ id: message?.id }, { status: 201 })
  } catch (error: any) {
    const parser = new PostalMime()
    const rawEmail = new Response(raw)
    const email = await parser.parse(await rawEmail.arrayBuffer()) as IncomingCloudflareEmail
    return apiErrorHandling(error, email)
  }
}
