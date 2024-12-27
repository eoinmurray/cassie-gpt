import { Resend } from 'resend';
import { logging } from '@/utils/logging';
import prisma from '@/prisma';
import prismaToResend from '@/types/prisma-to-resend';
import omit from '@/utils/omit';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function (message: any): Promise<any> {
  const lockedMessage = await prisma.message.update({ where: { id: message.id }, data: { locked: true } })

  const payload = await prismaToResend(message);
  logging.log({ sendResponse: omit(payload, ['text', 'cc', 'bcc', 'html']) }, 1)

  if (process.env.PRISMA_ON === "0") {
    logging.log('PRISMA_ON=0, skipping send', 1)
    return lockedMessage
  }

  const updatedMessage = await prisma.message.update({ 
    where: { id: message.id }, 
    data: { 
      sentAt: new Date(), 
      locked:false
    }
  })
  
  if (process.env.RESEND_ON === "0") {
    logging.log('RESEND_ON=0, skipping resend', 1)
    return updatedMessage
  }

  const { data } = await resend.emails.send(payload);

  return await prisma.message.update({ 
    where: { id: message.id }, 
    data: { 
      resendId: data?.id,
    }
  })
}