#!/usr/bin/env node
import JamClient from "jmap-jam"
import isCLI from "@/utils/is-cli"
import { logging } from "@/utils/logging"

export default async function fastmailFetch ({ subjectToSearch }: { subjectToSearch?: string }) {
  if (!process.env.TEST_FASTMAIL_API_KEY) throw new Error("Please set your TEST_FASTMAIL_API_KEY")
  const jam = new JamClient({ sessionUrl: "https://api.fastmail.com/.well-known/jmap", bearerToken: process.env.TEST_FASTMAIL_API_KEY })
  const accountId = await jam.getPrimaryAccount()

  const q: any = { accountId }
  if (subjectToSearch) { q.filter = { subject: subjectToSearch } }

  const [query] = await jam.api.Email.query(q)
  const [emailsFetch] = await jam.api.Email.get({
    accountId,
    ids: query.ids,
    properties: ["subject", "to", "cc", "bcc", "textBody", "receivedAt", "from", "preview"],
  })

  return emailsFetch.list
}

if (isCLI(import.meta.url)) {
  const emails = await fastmailFetch({
    subjectToSearch: process.argv[2]
  })

  for (const email of emails) {
    logging.log({
      subject: email.subject,
      preview: email.preview,
      to: email.to?.map((to: { email: string }) => to.email).join(", "),
      from: email.from?.map((from: { email: string }) => from.email).join(", "),
    })
  }
}