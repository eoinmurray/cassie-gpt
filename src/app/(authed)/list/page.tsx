import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AssistantTableRow from "@/components/assistant-table-row"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/prisma"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

export default async function Page() {
  const session = await auth()
  if (!session?.user) return redirect("/login")

  let assistants = await prisma.assistant.findMany({ include: { threads: true } })

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="grow">
          <CardTitle>Assistants</CardTitle>
          <CardDescription>Your OpenAI Assistants available over email.</CardDescription>
        </div>
        <div>
          <Button 
            asChild
            variant="secondary"
          >
            <Link 
              href="/new"
            >
              <PlusIcon 
                className="mr-2" 
                width={16} 
                height={16}
              />
              New Assistant
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-inherit dark:hover:bg-inherit">
              <TableHead>Assistant</TableHead>
              <TableHead className="hidden sm:table-cell">Activity</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assistants.length > 0 ? 
              assistants.map((assistant: any) => {
                return (
                  <AssistantTableRow key={assistant.id} assistant={assistant} />
                )
              })
               : 
              (
              <TableRow className="hover:bg-inherit dark:hover:bg-inherit">
                <TableCell>
                  No assistants found. Create one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
