import * as React from "react"
import { formatRelative } from "date-fns"
import Link from "next/link"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default async function AssistantTableRow({ assistant }: { assistant: any}) {
  return (
    <TableRow className="bg-accent">
      <TableCell
        className="p-0"
      >
          <Button
            variant="link"
            size="sm"
            asChild
          >
            <Link
              href={`/${assistant?.id}`}
            >
            {assistant?.alias}@{process.env.NEXT_PUBLIC_DOMAIN}
            </Link>
          </Button>
      </TableCell>
      <TableCell className="hidden sm:table-cell">{assistant?.threads.length} threads</TableCell>
      <TableCell className="hidden md:table-cell">
        {formatRelative(assistant?.createdAt, new Date())}
      </TableCell>
    </TableRow>
  )
}
