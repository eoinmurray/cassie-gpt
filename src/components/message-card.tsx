"use server";
import toMarkdown from "@/utils/to-markdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function splitEmail(content: any) {
  const markers = [/On .* wrote:/, /Forwarded message:/];
  for (const marker of markers) {
      const parts = content.split(marker);
      if (parts.length > 1) {
          return [parts[0], content.replace(parts[0], '')];
      }
  }
  return [content, ''];
}

export default async function MessageCard({
  avatarLetter,
  writtenByLabel,
  messageContent,
  rightMenu
}: any) {
  // eslint-disable-next-line no-unused-vars
  const [aboveFold, belowFold] = splitEmail(messageContent);
  const __html = await toMarkdown(aboveFold);

  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row grow gap-2 items-center font-semibold">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{avatarLetter.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="capitalize"> {writtenByLabel} </h2>
        </div>
        <div>
            {rightMenu}
          </div>
      </div>
      
      <div 
        className="prose prose-sm dark:prose-invert pl-8"
        dangerouslySetInnerHTML={{ __html }} 
      />
    </div>
  )
}

