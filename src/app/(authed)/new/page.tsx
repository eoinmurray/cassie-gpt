"use server"
import AssistantNewForm from "@/components/assistant-new-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { auth } from "@/auth"
import createNewAssistant from "@/actions/server-action-create-new-assistant"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await auth()
  if (!session?.user) return redirect("/login")
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Assistant</CardTitle>
        <CardDescription>Add an OpenAI Assistants to make it available over email.</CardDescription>
      </CardHeader>
      <CardContent>
        <AssistantNewForm 
          handleSubmitServerAction={createNewAssistant}
        />
      </CardContent>
    </Card>
  )
}
