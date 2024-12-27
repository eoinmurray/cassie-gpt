import { sleep } from 'zx'
import { logging } from '@/utils/logging'

let interval = 1000

if (process.env.INTERVAL && !isNaN(parseInt(process.env.INTERVAL))) {
  interval = parseInt(process.env.INTERVAL)
} else {
  throw new Error(`INTERVAL is not set or is not a number`)
}

async function pingEndpoint({ endpoint = 'https://your-endpoint.com/api' }) {
  logging.log(`CHRON set to ping ${endpoint} every ${interval}ms`, 1)
  // eslint-disable-next-line no-constant-condition
  while (true) { 
    try {
      const response = await fetch(endpoint)
      logging.log(`PING ${new URL(endpoint).pathname} ${response.status} ${response.statusText}`, 3)
      if (!response.ok && logging.level) {
        logging.log(`PINGERROR ${new URL(endpoint).pathname} ${response.status} ${response.statusText} => "${await response.json()}"`, 1)
      }
    }
    catch (error: any) {
      logging.error(error.message)
    }
    await sleep(interval)
  }
}

pingEndpoint({ endpoint: `https://${process.env.NEXT_PUBLIC_DOMAIN}/api/generate-ai-responses`, })
pingEndpoint({ endpoint: `https://${process.env.NEXT_PUBLIC_DOMAIN}/api/send-responses`})