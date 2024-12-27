"use server";
import { Button } from "@/components/ui/button"
import { BotIcon } from "lucide-react";
import Link from "next/link";
import { HeaderMenu } from "./header-menu";
import { signOut } from "@/auth"
import { redirect } from "next/navigation";

export default async function () {
  const handleSignOut = async () => {
    "use server"
    await signOut()
    redirect('/')
  }

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex flex-row gap-4 items-center">
        <Button 
          asChild
          variant="outline"
        >
          <Link 
            href="/"
            className="font-mono"
          >
            <BotIcon 
              className="mr-2" 
              width={16} 
              height={16}
            />
            e01ns testbots
          </Link>
        </Button>
        {/* <Button 
          asChild
          variant="link"
        >
          <Link 
            href="/"
          >
            My Assistants
          </Link>
        </Button> */}
        </div>
      <div className="flex flex-row gap-4 items-center">
        <HeaderMenu 
          handleSignOut={handleSignOut}
        />
      </div>
    </div>
  )

}