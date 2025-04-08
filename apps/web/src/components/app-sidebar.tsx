"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { NavMain } from "@/components/nav-main"
import { NavRecipies } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { api } from "@/trpc/react"
import { Home, Plus, BookOpen } from "lucide-react"
import { useEffect } from "react"
import { BookSwitcher } from "@/components/book-switcher"
import { useRouter, useParams } from "next/navigation";
import { Badge } from "./ui/badge"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const router = useRouter()
  const { data: books = [] } = api.book.getAll.useQuery()
  const [activeBookId, setActiveBookId] = React.useState("")
  const { data: recipes = [] } = api.recipe.getAll.useQuery({ bookId: activeBookId }, {
    enabled: !!activeBookId
  })
  const params = useParams()

  // Update active book when books are loaded
  useEffect(() => {
    if (books.length > 0 && !activeBookId) {
      const firstBook = books[0]
      if (firstBook) {
        setActiveBookId(firstBook.id)
      }
    }
  }, [books, activeBookId])

  const navItems = [
    {
      title: "Home",
      url: activeBookId ? `/admin/${activeBookId}` : "/",
      icon: Home,
    },
    {
      title: "Create Recipe",
      url: `/admin/${activeBookId}/create`,
      icon: Plus,
    },
  ]
  const recipeItems = recipes.map((recipe) => ({
    id: recipe.id,
    bookId: recipe.bookId,
    name: recipe.metadata?.name || "Untitled Recipe", 
    url: `/admin/${activeBookId}/${recipe.id}`,
    latestVersion: recipe.version || 1
  }))

  const handleBookChange = (bookId: string) => {
    setActiveBookId(bookId)
    router.push(`/${bookId}`)
  }

  useEffect(() => {
    const currentBookId = params.book as string
    setActiveBookId(currentBookId)
  }, [params.book])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BookSwitcher
          books={books.map((book) => ({
            name: book.id,
            logo: BookOpen,
            subtitle: `${book.recipes.length} recipes`
          }))}
          onBookChange={handleBookChange}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavRecipies recipes={recipeItems} />
      </SidebarContent>
      <SidebarFooter>
        {session?.user && (
          <NavUser user={{
            name: session.user.name || "",
            email: session.user.email || "",
            avatar: session.user.image || "",
          }} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
