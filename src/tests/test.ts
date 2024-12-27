#!/usr/bin/env bun
import { startTestService } from '@/tests/utils/start-service';
import { logging } from '@/utils/logging';
import awaitHealthcheck from './utils/await-healthcheck';
import testByFastmail from './test-by-fastmail';
import chalk from 'chalk';
import minimist from 'minimist';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getMimeType } from '@/utils/mimetypes';

const argv = minimist(process.argv.slice(2))

const CHRON = parseInt(process.env.CHRON || "0")
const NEXT_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
const TEST_SERVER_ON = parseInt(process.env.TEST_SERVER_ON || "0")
const ADMIN_BOT_NAME = process.env.ADMIN_BOT_NAME
if (!process.env.MAIN_EMAIL_DOMAIN) throw new Error('MAIN_EMAIL_DOMAIN not found')

let chronService: any = null
if (CHRON === 1) {
  logging.log('Starting chron service', 0)
  chronService = startTestService({
    command: 'bun ./src/chron.ts', 
  })
}

let nextDevService: any = null

if (NEXT_PUBLIC_DOMAIN?.includes("laptop") && TEST_SERVER_ON === 1) {
  logging.log('Starting next dev service', 0)
  nextDevService = await startTestService({
    command: 'next dev', 
    filterOutEvents: [
      'GET /api/generate-ai-responses',
      'GET /api/send-responses',
    ],
  })
}

let vercelService: any = null
if (NEXT_PUBLIC_DOMAIN?.includes("testbot") && TEST_SERVER_ON === 1) {
  logging.log('Starting vercel service', 0)
  vercelService = await startTestService({
    command: 'npx vercel logs testbot.e01n.dev -f'
  })  
}

await awaitHealthcheck()
const random = Math.random().toString(36).substring(7);
const filename = 'file.txt'

const emails: any[] = await testByFastmail({
  toEmail: argv.email || `${ADMIN_BOT_NAME}@${process.env.NEXT_PUBLIC_DOMAIN}`,
  subject: argv.subject || random,
  textBody: argv._[0] || "who are you and what can you do?",
  // attachments: [{
  //   blob: await readFile(join('src', 'tests', 'fixtures', filename)),
  //   filename,
  //   type: getMimeType(filename),
  // }],
})

if (chronService) {
  await chronService;
  await chronService.kill()
}

if (nextDevService) {
  await nextDevService;
  await nextDevService.kill()
}

if (vercelService) {
  await vercelService;
  await vercelService.kill()
}

const emailWithError = emails.find(email => email.preview.includes("error: "))
if (emailWithError) {
  logging.log(chalk.red(`Test failed, reply email arrived but reported an error`))
  logging.log({
    subject: emailWithError.subject,
    preview: emailWithError.preview,
    from: emailWithError.from?.map((from: { email: any; }) => from.email).join(', '),
    to: emailWithError.to?.map((to: { email: any; }) => to.email).join(', '),
  })
} else { 
  logging.log(chalk.green('Test passed'))
  for (const email of emails) {
    logging.log({
      subject: email.subject,
      preview: email.preview,
      from: email.from?.map((from: { email: any; }) => from.email).join(', '),
      to: email.to?.map((to: { email: any; }) => to.email).join(', '),
    })
  }
}