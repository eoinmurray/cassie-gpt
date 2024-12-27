import { Resend } from "resend";
import { logging } from "@/utils/logging";
import { IncomingCloudflareEmail } from "@/types/incoming-cloudflare-email";
import cloudflareIncomingToPrismaMessageCreate from "@/types/cloudflare-to-prisma";

export default async function (error: any, email?: IncomingCloudflareEmail) {
  logging.error(error)

  if (email) {

    const message = cloudflareIncomingToPrismaMessageCreate(email)

    const resend = new Resend(process.env.RESEND_API_KEY);
    const payload = {
      from: `noreply <noreply@${process.env.NEXT_PUBLIC_DOMAIN}>`,
      to: [email.from.address],
      subject: `re: ${email.subject}`,
      text: `error: ${error.message}${process.env.DEBUG === "2" ? `\n\nStack: ${error.stack}` : ``}`,
      headers: {
        "In-Reply-To": message.messageId,
        "References": [...(message.existingReferences as []), message.messageId].join(', ')
      }
    }
    await resend.emails.send(payload);
  }

  return Response.json({ message: error.message }, { status: 400 })
}