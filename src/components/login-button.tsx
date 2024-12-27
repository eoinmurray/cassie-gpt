import { signIn } from "@/auth"
import { redirect } from "next/navigation"
 
export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
        console.log(formData)
        await signIn("resend", { email: formData.get("email") })
        redirect("/")
      }}
    >
      <input 
        type="text" 
        name="email" 
        placeholder="Email" 
        defaultValue="me@eoinmurray.info" 
      />
      <button type="submit">Signin with Resend</button>
    </form>
  )
}