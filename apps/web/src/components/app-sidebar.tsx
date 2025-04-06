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
import { BlogSwitcher } from "@/components/blog-switcher"
import { useRouter, useParams } from "next/navigation";
import { Badge } from "./ui/badge"

function VersionBadge({ version }: { version: number }) {
  return (
    <Badge variant="outline" className="px-2 mx-0">
      {version}
    </Badge>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const router = useRouter()
  const { data: blogs = [] } = api.blog.getAll.useQuery()
  const [activeBlogId, setActiveBlogId] = React.useState("")
  const { data: recipes = [] } = api.recipe.getAll.useQuery({ blogId: activeBlogId }, {
    enabled: !!activeBlogId
  })
  const params = useParams()

  // Update active blog when blogs are loaded
  useEffect(() => {
    if (blogs.length > 0 && !activeBlogId) {
      const firstBlog = blogs[0]
      if (firstBlog) {
        setActiveBlogId(firstBlog.id)
      }
    }
  }, [blogs, activeBlogId])

  const navItems = [
    {
      title: "Home",
      url: activeBlogId ? `/admin/${activeBlogId}` : "/",
      icon: Home,
    },
    {
      title: "Create Recipe",
      url: `/admin/${activeBlogId}/create`,
      icon: Plus,
    },
  ]
  const recipeItems = recipes.map((recipe) => ({
    id: recipe.id,
    blogId: recipe.blogId,
    name: recipe.metadata?.name || "Untitled Recipe", 
    url: `/admin/${activeBlogId}/${recipe.id}`,
    icon: <VersionBadge version={recipe.version || 1} />,
    latestVersion: recipe.version || 1
  }))

  const handleBlogChange = (blogId: string) => {
    setActiveBlogId(blogId)
    router.push(`/${blogId}`)
  }

  useEffect(() => {
    const currentBlogId = params.blog as string
    setActiveBlogId(currentBlogId)
  }, [params.blog])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BlogSwitcher
          blogs={blogs.map((blog) => ({
            name: blog.id,
            logo: BookOpen,
            subtitle: `${blog.recipes.length} recipes`
          }))}
          onBlogChange={handleBlogChange}
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
