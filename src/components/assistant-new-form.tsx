"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const formSchema = z.object({
  alias: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  assistantId: z.string().min(29, {
    message: "Assistant ID must be a valid UUID.",
  }),
  openai_key: z.string().min(50, {
    message: "Service Account Key must be provided.",
  })
})

export default function NewAssistantForm({ handleSubmitServerAction }: { handleSubmitServerAction: any }) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alias: "",
      assistantId: "",
      openai_key: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await handleSubmitServerAction(values)
    if (data && data.message) {
      form.setError("alias", {
        type: "manual",
        message: data.message,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assistant Alias</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription>
                This assistant will be reachable at 
                <span
                  className="mx-1 underline"
                >
                {`${field.value}@${process.env.NEXT_PUBLIC_DOMAIN}`}
                </span>

              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assistantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assistant ID</FormLabel>
              <FormControl>
                <Input placeholder="asst_xxxx..." {...field} />
              </FormControl>
              <FormDescription>
              <Link
                  href="https://platform.openai.com/assistants"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline flex flex-row"
                >
                  Please input the OpenAI Assistant ID.
                </Link>
              
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openai_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Account Key</FormLabel>
              <FormControl>
                <Input placeholder="sk-xxxxxxxxxxx-xxxx..." {...field} />
              </FormControl>
              <FormDescription>
                <Link
                  href="https://help.openai.com/en/articles/9186755-managing-your-work-in-the-api-platform-with-projects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline flex flex-row"
                >
                  Please follow this guide to create an OpenAI Service Account.
                  <ExternalLink width={12} />
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}