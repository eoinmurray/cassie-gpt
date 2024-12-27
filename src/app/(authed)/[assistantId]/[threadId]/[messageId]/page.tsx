import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import MessagePairCard from "@/components/message-pair-card"
import { auth } from "@/auth"
import prisma from "@/prisma"
import { redirect } from "next/navigation"

export default async function Page({ params }: { params: { assistantId: string, threadId: string, messageId: string }}) {
  const session = await auth()
  if (!session?.user) return redirect("/login")

  let message = await prisma.message.findUnique({ 
    where: { 
      id: params.messageId
    }, 
    include: { 
      assistant: true,
      thread: true
    },
  });

  const assistant = message?.assistant

  return (
    <Card>
      <CardHeader className="flex flex-col items-start">
        <CardTitle>Viewing one message</CardTitle>
        <CardDescription>
          Reply to this thread by sending an email to:
          <br />
          <span className="font-semibold">{assistant?.alias}@{process.env.NEXT_PUBLIC_DOMAIN} </span>
          <br />
          subject: "{message?.thread?.alias}"
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <MessagePairCard key={message?.id} message={message} />
      </CardContent>

    </Card>

    
  )
}
