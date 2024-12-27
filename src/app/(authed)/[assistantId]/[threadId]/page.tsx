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

export default async function Page({ params }: { params: { assistantId: string, threadId: string }}) {
  const session = await auth()
  if (!session?.user) return redirect("/login")

  let thread = await prisma.thread.findUnique({ 
    where: { 
      id: params.threadId
    }, 
    include: { 
      assistant: true,
      messages: {
        include: {
          assistant: true,
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    },
  });

  const assistant = thread?.assistant

  return (
    <Card>
      <CardHeader className="flex flex-col items-start">
        <CardTitle>Thread "{thread?.alias}"</CardTitle>
        <CardDescription>
          Reply to this thread by sending an email to:
          <br />
          <span className="font-semibold">{assistant?.alias}@{process.env.NEXT_PUBLIC_DOMAIN} </span>
          <br />
          subject: "{thread?.alias}"
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {thread?.messages.map((message: any) => (
          <>
          <MessagePairCard key={message.id} message={message} />
          <div className="w-full opacity-25 border border-double" />
          </>
        ))}
      </CardContent>
    </Card>

    
  )
}
