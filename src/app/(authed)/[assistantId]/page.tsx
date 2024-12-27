import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ThreadTableRow from "@/components/thread-table-row"
import { auth } from "@/auth"
import * as React from "react"
import prisma from "@/prisma"
import AssistantMenu from "@/components/assistant-menu"
import { redirect } from "next/navigation"

export default async function Page({ params }: { params: { address: string, assistantId: string}}) {
  const session = await auth()
  if (!session?.user) return redirect("/login")

  let assistant = await prisma.assistant.findUnique({ 
    where: { 
      id: params.assistantId
    },
    include: {
      threads: {
        include: {
          assistant: true,
          messages: true
        }
      },
      messages: true
    }
  })

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="grow">
          <CardTitle>Assistant {assistant?.alias}</CardTitle>
          <CardDescription>
            OpenAI assistant is aliased to {assistant?.alias}@{process.env.NEXT_PUBLIC_DOMAIN}.
          </CardDescription>
        </div>

        <AssistantMenu assistantId={assistant?.id!} />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden sm:table-cell">Activity</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assistant?.threads.map((thread: any) => {
                  return (
                    <ThreadTableRow key={thread.id} thread={thread} />
                  )
                })}
              </TableBody>
            </Table>

      </CardContent>
    </Card>
  )
}
