import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import MessageCard from "@/components/message-card";
import Link from "next/link";
import ms from "ms";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default async function MessagePairCard({ message }: { message: any}) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <MessageCard
          avatarLetter={'Y'}
          writtenByLabel={`You`}
          messageContent={message.receivedMessage}
          rightMenu={(
            <div className="flex flex-row gap-2 text-sm text-gray-400 font-semibold items-center">
              <div>
                {ms(Date.now() - new Date(message.createdAt).getTime())} ago
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <Link 
                        href={`/${message.assistantId}/${message.threadId}/${message.id}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Open this message directly.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
            </div>
          )}
        />
        <div className="w-full opacity-15 border border-dashed" /> 
          <MessageCard
            avatarLetter={message.assistant?.alias[0] || 'A'}
            writtenByLabel={message.assistant?.alias}
            messageContent={message.outboundMessage || 'No response yet.'}
            createdAt={message.createdAt}
          />
        </div>
    </div>
  )
}

