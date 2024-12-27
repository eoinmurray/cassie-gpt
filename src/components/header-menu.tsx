"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ComputerIcon, Moon, Settings, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function HeaderMenu({ handleSignOut }: { handleSignOut: any, user?: any }) {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="secondary"
          size="icon"
        >
          <Settings className="h-4 w-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuItem onClick={() => handleSignOut()}>
            Sign Out  
          </DropdownMenuItem>
          
          <DropdownMenuSubTrigger>
            <span>Light/Dark</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={() => setTheme("light")}
                className="flex flex-row gap-2"
              >
                <Sun 
                  width={16} 
                  height={16}
                />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTheme("dark")} 
                className="flex flex-row gap-2"
              >
                <Moon
                  width={16} 
                  height={16}
                />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTheme("system")}
                className="flex flex-row gap-2"
              >
                <ComputerIcon
                  width={16} 
                  height={16}
                />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>

        </DropdownMenuSub>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
