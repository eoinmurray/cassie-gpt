import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

export default async function() {
  const session = await auth()
  if (session?.user) return redirect("/")

  return (
    <Card className="min-w-xs w-full max-w-xs mx-auto my-12">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <Construction className="w-6 h-6" />
          Login
        </CardTitle>
        <CardDescription>
          This is a work in progress.  
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            "use server"
            await signIn("resend", { email: formData.get("email") })
            redirect("/")
          }}
          className="space-y-2"
        >
          <Input
            type="text" 
            name="email" 
            placeholder="Email" 
            defaultValue="me@eoinmurray.info" 
          />
          <Button 
            type="submit"
            variant="default"
            className="w-full"
          >
            Send me a  Magic Link
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <CardDescription>If you find a bug, please report it.</CardDescription>
      </CardFooter>
    </Card>
    
  )
}