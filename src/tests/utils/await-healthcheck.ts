import { logging } from "@/utils/logging"
import runHealthcheck from "./run-healthcheck"
import waitForCondition from "./wait-for-condition"

const NEXT_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
const INTERVAL = parseInt(process.env.INTERVAL || "1000")

export default async function awaitHealthcheck() {
  logging.log(`Waiting for healthcheck on: ${NEXT_PUBLIC_DOMAIN}`)
  const timeout = 2000
  let totalTime = 0
  await waitForCondition(async () => {
    totalTime += INTERVAL
    const envHealth =  await runHealthcheck()
    if (envHealth?.NEXT_PUBLIC_DOMAIN !== NEXT_PUBLIC_DOMAIN) {
      if (totalTime > timeout) {
        logging.error(`Healthcheck failed for: ${NEXT_PUBLIC_DOMAIN}`)
        return true
      }
      return false
    }
    logging.log(`Healthcheck passed for: ${NEXT_PUBLIC_DOMAIN}`)
    return true
  }, INTERVAL)
}