"use client";
import deleteAssistant from "@/actions/server-action-delete-assistant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ExternalLink, MenuIcon, Trash } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react";
import Link from "next/link";

export default function AssistantMenu({ assistantId }: { assistantId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="secondary"
          size="icon"
        >
          <MenuIcon className="h-4 w-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link
            href={`https://platform.openai.com/playground/assistants?assistant=${assistantId}&mode=assistant`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center flex-row space-x-2"
          >
            <div>
              OpenAI Playground
              </div>
              <div>
              <ExternalLink width={12} />
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true)
            if (confirm("Are you sure you want to delete this assistant?")) {
              await deleteAssistant(assistantId)
            }
            setIsLoading(false)
          }}

          className="flex items-center flex-row space-x-2"
        >
          Delete
          <Trash width={12} />
        </DropdownMenuItem>
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}