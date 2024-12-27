import { logging } from "@/utils/logging"
import getFixture from "./get-fixture"
import makeCall from "./make-call"
import waitForCondition from "./wait-for-condition"
import prisma from "@/prisma"

const NEXT_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
const INTERVAL = parseInt(process.env.INTERVAL || "1000")

export default async function () {
  const fixture = await getFixture({ fixtureName: "1"})
  const createMessageUrl = `https://${NEXT_PUBLIC_DOMAIN}/api/create-message`
  const message = await makeCall(createMessageUrl, fixture)

  if (!message) {
    logging.error('No message returned from create-message')
    // process.exit(1)
  }

  message && await waitForCondition(async () => {
    logging.log(`Checking message ${message.id} for sentAt and outboundMessage`, 1)
    const updatedMessage = await prisma.message.findUnique({ where: { id: message.id } })
    if (updatedMessage?.sentAt && updatedMessage.outboundMessage) {
      logging.log({
        id: updatedMessage?.id,
        outboundMessage: updatedMessage?.outboundMessage,
        sentAt: updatedMessage?.sentAt,
      }, 1)
      return true
    }

    logging.log(`Message ${updatedMessage?.id} sentAt: ${updatedMessage?.sentAt} outboundMessage: ${updatedMessage?.outboundMessage}, will try again`, 1)
    return false
  }, INTERVAL)

}