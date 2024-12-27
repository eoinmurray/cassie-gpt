import prisma from "@/prisma"

export default async function checkPermissions({ fromEmail, toEmails, ccEmails, bccEmails, botOwner }: {
  fromEmail: string,
  toEmails: string,
  ccEmails: string,
  bccEmails: string,
  botOwner: any,
}): Promise<any> {
  const usersInFrom = await prisma.user.findMany({ where: { email: fromEmail } })
  const usersInTo = await prisma.user.findMany({ where: { email: { in: toEmails.split(',') } } })
  const usersInCC = await prisma.user.findMany({ where: { email: { in: ccEmails.split(',') } } })
  const usersInBCC = await prisma.user.findMany({ where: { email: { in: bccEmails.split(',') } } })
  const allUserEmails = usersInFrom.concat(usersInTo).concat(usersInCC).concat(usersInBCC).map(user => user.email)
  const allUserIds = usersInFrom.concat(usersInTo).concat(usersInCC).concat(usersInBCC).map(user => user.id)

  if (botOwner.id && allUserIds.includes(botOwner.id)) {
    return botOwner.id
  } else {
    throw new Error(`Bot owner ${botOwner.email} is not in the list of users ${allUserEmails.join(', ')}`)
  }
}