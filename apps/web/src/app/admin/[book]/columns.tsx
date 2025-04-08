"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Recipe, RecipeMetadata } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

type RecipeWithMetadata = Recipe & {
  metadata: RecipeMetadata | null
}

export const columns: ColumnDef<RecipeWithMetadata>[] = [
  {
    accessorKey: "metadata.name",
    header: "Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.metadata?.name || "Untitled Recipe"}</div>
    },
  },

  {
    accessorKey: "version",
    header: "Version",
    cell: ({ row }) => {
      return <Badge variant="outline">v{row.original.version}</Badge>
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      return <div className="text-muted-foreground">{format(new Date(row.original.updatedAt), "MMM d, yyyy")}</div>
    },
  },
] 