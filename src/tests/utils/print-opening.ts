import { logging } from "@/utils/logging";

export default function printOpening() {
  const env = {
    start: Date.now(),
    DEBUG: process.env.DEBUG,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    OPENAI_ON: process.env.OPENAI_ON,
    PRISMA_ON: process.env.PRISMA_ON,
    RESEND_ON: process.env.RESEND_ON,
    TEST_SERVER_ON: process.env.TEST_SERVER_ON,
    FIXTURE: process.env.FIXTURE,
    ONE_CALL: process.env.ONE_CALL,
    CHRON: process.env.CHRON,
    SELF_CHAIN: process.env.SELF_CHAIN,
    PROOF: process.env.PROOF,
    INTERVAL: process.env.INTERVAL,
    INSTRUCTIONS_PATH: process.env.INSTRUCTIONS_PATH,
    TEST_ASSISTANT_ID: process.env.TEST_ASSISTANT_ID?.replace(/./g, 'x'),
    TAVILY_API_KEY: process.env.TAVILY_API_KEY?.replace(/./g, 'x'),

    TEST_FASTMAIL_USERNAME: process.env.TEST_FASTMAIL_USERNAME,
    DEVELOPMENT_DOMAIN: process.env.DEVELOPMENT_DOMAIN,
    PRODUCTION_DOMAIN: process.env.PRODUCTION_DOMAIN,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL?.replace(/./g, 'x'),
    ADMIN_BOT_NAME: process.env.ADMIN_BOT_NAME?.replace(/./g, 'x'),
    TEST_BOT_NAME: process.env.TEST_BOT_NAME?.replace(/./g, 'x'),
  }
  
  logging.log({env})
  return env
}