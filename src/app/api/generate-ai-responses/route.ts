import generateAiResponses from "@/actions/system-generate-ai-responses"
import apiErrorHandling from "@/utils/api-error-handling";
import { logging } from "@/utils/logging";
export const revalidate = 0
export const maxDuration = 60;
export const dynamic = 'force-dynamic'

export async function GET () {
  try {
    const messages = await generateAiResponses()
    if (messages.length > 0) {
      if (process.env.SELF_CHAIN === "1") {
        logging.log(`SELF_CHAIN: ${process.env.SELF_CHAIN} so calling /api/send-responses`)
        await fetch(`https://${process.env.NEXT_PUBLIC_DOMAIN}/api/send-responses`)
      }
      return Response.json({ amount: messages.length }, { status: 201, statusText: 'ok' })
    } else {
      return new Response(null, { status: 200, statusText: 'ok' })
    }
  } catch (error: any) {
    return apiErrorHandling(error)
  }
}
