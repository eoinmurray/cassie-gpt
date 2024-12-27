import fastmailFetch from "@/actions/fastmail-fetch";
import fastmailSend from "@/actions/fastmail-send";
import { logging } from "@/utils/logging";
import waitForCondition from "./utils/wait-for-condition";

export default async function testByFastmail({
  toEmail,
  subject,
  textBody,
  attachments
}: {
  toEmail?: string,
  subject: string,
  textBody?: string,
  attachments?: any[]
}) {
  if (!process.env.TEST_FASTMAIL_API_KEY) throw new Error("Please set your TEST_FASTMAIL_API_KEY")
  if (!process.env.TEST_FASTMAIL_USERNAME) throw new Error("Please set your TEST_FASTMAIL_USERNAME")

  await fastmailSend({
    toEmail: toEmail || process.env.TEST_FASTMAIL_USERNAME, 
    subject,
    textBody: textBody || "Whats your name",
    attachments
  })

  const desiredResponses = 2
  await waitForCondition(async () => {
    const emails = await fastmailFetch({ subjectToSearch: subject })
    logging.log(`Waiting for response.`)
    return emails.length >= desiredResponses
  }, 1000)

  const emails = await fastmailFetch({ subjectToSearch: subject })
  return emails as any[]
}