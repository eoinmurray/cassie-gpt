import sendResponses from "@/actions/system-send-responses"
import apiErrorHandling from "@/utils/api-error-handling";

export const revalidate = 0
export const maxDuration = 60;
export const dynamic = 'force-dynamic'

export async function GET () {
  try {
    const messages = await sendResponses()
    if (messages) {
      return Response.json({ amount: messages.length, messages }, {  status: 201, statusText: 'ok' })
    } else {
      return new Response(null, { status: 200, statusText: 'ok' })
    }
  } catch (error: any) {
    return apiErrorHandling(error)
  }
}
