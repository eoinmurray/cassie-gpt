"use client"

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
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z
  .string()
  .min(1, { message: "This field has to be filled." })
  .email("This is not a valid email.")
})

export function MarketingEmailForm({
  handleEmailToResendServerAction,
}: {
  handleEmailToResendServerAction: (email: string) => Promise<any>
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await handleEmailToResendServerAction(values.email)
    } catch (error: any) {
      form.setError("email", { type: "custom", message: error.message })
    }
  }
  
  return (
    <Form
      {...form}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-sm">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Your email address" 
                  {...field}
                />
              </FormControl>
  
              {(form.formState.errors.email && form.formState.errors.email.type !== "custom") && (
                <FormMessage />
              )}
            </FormItem>
          )}
        />
        <Button 
          type="submit"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
            Sign Up
        </Button>
        

        {form.formState.isSubmitSuccessful && (
          <p>
            You{"'"}ve successfully signed up to be a beta tester. We{"'"}ll be in touch soon!
          </p>
        )}
      </form>
    </Form>
  )
}
