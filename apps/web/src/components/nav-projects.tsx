"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Pencil,
  type LucideIcon,
  Clock,
  History,
  DiffIcon,
  Lock
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import { ReactElement } from "react"

export function NavRecipies({
  recipes,
}: {
  recipes: {
    id: string
    bookId: string
    name: string
    url: string
    icon?: ReactElement
    latestVersion: number
    public: boolean
    draft: boolean
  }[]
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const utils = api.useUtils()
  const { mutate: deleteRecipe } = api.recipe.delete.useMutation({
    onSuccess: async () => {
      await utils.recipe.getAll.invalidate();
      toast.success("Recipe deleted successfully!")
      router.push(`/admin/${recipes[0]?.bookId}`)
    },
  })
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recipes</SidebarGroupLabel>
      <SidebarMenu >
        {recipes.map((item) => (
          <SidebarMenuItem key={item.name} >
            <SidebarMenuButton asChild isActive={pathname.includes(item.url)}>
              <div className="cursor-pointer" onClick={() => router.push(item.url)}>
                <div className="flex gap-2 items-center">
                  {!item.public && <Lock className="h-3 w-3 text-muted-foreground" />}
                   <div className={`h-2 w-2 rounded-full ${!item.draft ? "bg-green-500" : "bg-yellow-500"}`} />
                </div>
                {item.icon}
                <span>{item.name}</span>
              </div>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onClick={() => router.push(item.url)}>
                  <Folder className="text-muted-foreground" />
                  <span>View Recipe</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`${item.url}/edit`)}>
                  <Pencil className="text-muted-foreground" />
                  <span>Edit Recipe</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Recipe</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {item.latestVersion > 1 && (
                  <DropdownMenuItem onClick={() => router.push(`${item.url}/diff`)}>
                    <DiffIcon className="text-muted-foreground" />
                    <span>Compare Versions</span>
                  </DropdownMenuItem>
                )}
                {item.latestVersion > 1 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <History className="text-muted-foreground" />
                      <span>History</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>

                      <DropdownMenuSubContent>
                        {Array.from({ length: item.latestVersion }, (_, i) => i + 1).reverse().map(version => (
                          <DropdownMenuItem key={version} onClick={() => router.push(`${item.url}/${version}`)}>
                            <span>Version {version}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                )}
                <DropdownMenuItem onClick={() => deleteRecipe({ id: item.id, bookId: item.bookId })}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Recipe</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
