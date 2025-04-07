"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { CreateBookDialog } from "@/components/modals/create-book-dialog"

export function BookSwitcher({
  books,
  onBookChange,
}: {
  books: {
    name: string
    logo: React.ElementType
    subtitle: string
  }[]
  onBookChange: (bookId: string) => void
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const params = useParams()
  const currentBookId = params.book as string
  const activeBook = books.find(book => book.name === currentBookId) || books[0]
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const handleCreateBook = () => {
    setIsCreateDialogOpen(true)
  }
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {activeBook && (
                <>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <activeBook.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeBook.name}
                    </span>
                    <span className="truncate text-xs">{activeBook.subtitle}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Books
            </DropdownMenuLabel>
            {books.map((book, index) => (
              <DropdownMenuItem
                key={book.name}
                onClick={() => {
                  onBookChange(book.name)
                  router.push(`/admin/${book.name}`)
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <book.logo className="size-4 shrink-0" />
                </div>
                {book.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2"  onClick={handleCreateBook}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Create Book</div>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CreateBookDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </SidebarMenu>
  )
}