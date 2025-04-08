"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { DiffEditor } from "@monaco-editor/react"
import { register } from "@/components/editor/monaco/faux-language-server"

import { api } from "@/trpc/react"
import { RangeSlider } from "@/components/ui/range"
import { FloatingActionButton } from "@/components/ui/floating-action-button"

export default function DiffPage() {
  const params = useParams()
  const [leftVersion, setLeftVersion] = useState<number>(0)
  const [rightVersion, setRightVersion] = useState<number>(0)

  const { data: recipe, isLoading: recipeLoading } = api.recipe.getById.useQuery({
    id: params.id as string,
    bookId: params.book as string
  })

  const { data: leftRecipe, isLoading: leftLoading } = api.recipe.getByIdWithVersion.useQuery({
    id: params.id as string,
    version: leftVersion
  }, {
    enabled: leftVersion !== 0
  })

  const { data: rightRecipe, isLoading: rightLoading } = api.recipe.getByIdWithVersion.useQuery({
    id: params.id as string,
    version: rightVersion
  }, {
    enabled: rightVersion !== 0
  })

  // Auto-select the two latest versions when recipe data is loaded
  useEffect(() => {
    if (recipe && recipe.version > 1) {
      setRightVersion(recipe.version);
      setLeftVersion(recipe.version - 1);
    }
  }, [recipe]);

  if (recipeLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  if (!recipe) {
    return <div>Recipe not found</div>
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="relative flex-1">
        {(leftLoading || rightLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        
        {leftRecipe && rightRecipe ? (
          <DiffEditor
            original={leftRecipe.markdown}
            modified={rightRecipe.markdown}
            language="recipe"
            theme="recipe-theme"
            options={{
              readOnly: true,
              enableSplitViewResizing: false,
              renderSideBySide: false,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontSize: 14,
              lineNumbers: "on",
              renderWhitespace: "selection",
              wordWrap: "on"
            }}
            beforeMount={(monaco) => {
              register(monaco);
            }}
          />
        ) : (
          <div>Select versions to compare</div>
        )}
      </div>

      <FloatingActionButton>
      <div className="text-sm text-neutral-400 mb-5">Compare Versions</div>
        <RangeSlider
          min={1}
          max={recipe.version}
          prefix="v"
          step={1}
          value={[leftVersion || 1, rightVersion || recipe.version]}
          onValueChange={([left, right]) => {
            setLeftVersion(left)
            setRightVersion(right)
          }}
          formatValue={(value) => `v${value}`}
        />
      </FloatingActionButton>
    </div>
  )
}

