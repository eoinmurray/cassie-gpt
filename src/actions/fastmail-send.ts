#!/usr/bin/env node
import JamClient from "jmap-jam"
import isCLI from "@/utils/is-cli"
import { logging } from "@/utils/logging"
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getMimeType } from "@/utils/mimetypes";

const getSession = async () => {
  const response = await fetch(`https://api.fastmail.com/.well-known/jmap`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TEST_FASTMAIL_API_KEY}`,
    },
  });
  return response.json();
};


export default async function fastmailSend ({
  toEmail,
  subject,
  textBody,
  attachments
}: {
  toEmail: string
  subject: string,
  textBody?: string,
  attachments?: {
    blob: Buffer,
    filename: string,
    type: string,
  }[],
}) {
  if (!process.env.TEST_FASTMAIL_API_KEY) throw new Error("Please set your TEST_FASTMAIL_API_KEY")
  const jam = new JamClient({ sessionUrl: "https://api.fastmail.com/.well-known/jmap", bearerToken: process.env.TEST_FASTMAIL_API_KEY })
  const accountId = await jam.getPrimaryAccount()
  const [mailboxes] = await jam.api.Mailbox.get({ accountId })
  const sentboxId = mailboxes.list.find((mailbox: { role: string | null }) => mailbox.role === "sent")?.id as string
  const [identityQuery] = await jam.api.Identity.get({ accountId })
  const identityId = identityQuery.list.find((identity: { email: string }) => identity.email === process.env.TEST_FASTMAIL_USERNAME )?.id as string

  let blobs = [];
  if (attachments && attachments?.length !== 0) {
    const session = await getSession();
    for (const [, attachment] of attachments.entries()) {
      const upload = await fetch(session.uploadUrl.replace('{accountId}', accountId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.TEST_FASTMAIL_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: attachment.blob,
      });
  
      const data = await upload.json();
      blobs.push({
        blobId: data.blobId,
        type: attachment.type,
        name: attachment.filename,
      });
    }
  }


  const payload = {
    from: [{ email: process.env.TEST_FASTMAIL_USERNAME }],
    to: [{ email: toEmail }],
    subject,
    textBody: [{ partId: 'text' }],
    attachments: blobs,
    bodyValues: {
      text: {
        value: textBody,
      },
    },
    mailboxIds: { [sentboxId]: true }
  }

  const setResponse = await jam.api.Email.set({ 
    accountId, 
    create: { 
      // @ts-ignore
      HOLDING_VAR: payload
    }
  })

  // @ts-ignore
  const draft = setResponse[0].created.HOLDING_VAR;

  const sendResponse = await jam.api.EmailSubmission.set({ 
    accountId, 
    create: { 
      // @ts-ignore
      sendIt: {
        // @ts-ignore
        emailId: draft?.id, 
        identityId 
      } 
    }
  })
  const sent = sendResponse[0].created?.sendIt;
  if (sent?.sendAt) {
    logging.log(`Sent email with subject:"${subject}" to ${toEmail}`)
  } else {
    logging.error(`Failed to send email with subject ${subject} to ${toEmail}`)
  }
}

if (isCLI(import.meta.url)) {
  if (!process.env.TEST_FASTMAIL_API_KEY) throw new Error("Please set your TEST_FASTMAIL_API_KEY")
  if (!process.env.TEST_FASTMAIL_USERNAME) throw new Error("Please set your TEST_FASTMAIL_USERNAME")
 
  const filename = process.argv[4] || "file.txt";
  const random = Math.random().toString(36).substring(7);

  await fastmailSend({
    toEmail: process.argv[2] || process.env.TEST_FASTMAIL_USERNAME, 
    subject: `${random}`,
    textBody: process.argv[3] || "Whats your name",
    attachments: [{
      blob: await readFile(join('src', 'tests', 'fixtures', filename)),
      filename,
      type: getMimeType(filename),
    }],
  })
}