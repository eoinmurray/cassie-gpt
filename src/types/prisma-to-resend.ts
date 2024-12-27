import toMarkdown from "@/utils/to-markdown"
import transformAddresses from "@/utils/transform-addresses"

export default async function (message: { outboundMessage: string; cleanedSubject: any; fromEmail: any; toEmails: any; ccEmails: any; bccEmails: any; messageId: any; existingReferences: any }) {
  const text = `${message.outboundMessage}`
  const html = `${await toMarkdown(message.outboundMessage)}`
  const subject = `re: ${message.cleanedSubject}`

  const { to, from, cc, bcc } = transformAddresses({
    from: message.fromEmail,
    to: message.toEmails,
    cc: message.ccEmails,
    bcc: message.bccEmails,
  })

  const payload = {
    from,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    headers: {
      "In-Reply-To": message.messageId,
      "References": [...message.existingReferences, message.messageId].join(', ')
    }
  }

  return payload
}