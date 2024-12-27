import * as React from "react"
import { formatRelative } from "date-fns"
import Link from "next/link"
import { TableCell, TableRow } from "@/components/ui/table"

export default async function ThreadTableRow({ thread }: { thread: any}) {
  
  return (
    <TableRow className="bg-accent">
      <TableCell>
        <div className="font-medium">
          <Link
            className="text-blue-500 hover:underline font-semibold"
            href={`/${thread.assistant.id}/${thread?.id}`}
          >
            {thread.alias}
          </Link>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">{thread?.messages.length} messages</TableCell>
      <TableCell className="hidden md:table-cell">
        {formatRelative(thread?.createdAt, new Date())}
      </TableCell>
    </TableRow>
  )
}
