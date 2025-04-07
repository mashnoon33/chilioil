"use client"
import RecipeEditor from '@/components/editor/monaco';
import { defaultRecipe } from '@/components/editor/monaco/const';
import { RecipeComponent } from '@/components/recipie';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import type { AppRouter } from '@/server/api/root';
import { api } from '@/trpc/react';
import { parseRecipe } from "@repo/parser";
import type { inferRouterOutputs } from '@trpc/server';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { FloatingActionButton } from './ui/floating-action-button';
import { MoreVertical, Link } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toRecipeMarkdown } from "@/app/types/scraper";
import type { RecipeEditorRef } from "@/components/editor/monaco";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type Recipe = RouterOutputs["recipe"]["getById"];

interface CreateRecipeFormProps {
    mode?: 'create' | 'edit';
    initialRecipe?: Recipe;
    bookId: string;
}

export function CreateRecipeForm({ mode = 'create', initialRecipe, bookId }: CreateRecipeFormProps) {
    const [recipe, setRecipe] = useState<string>(initialRecipe?.markdown ?? defaultRecipe);
    const editorRef = useRef<RecipeEditorRef>(null);
    const utils = api.useUtils();
    const router = useRouter();

    const { mutate: createRecipe, isPending: isCreating } = api.recipe.create.useMutation({
        onSuccess: async (data) => {
            await utils.recipe.getAll.invalidate();
            toast.success("Recipe published successfully!");
            router.push(`/admin/${bookId}/${data.id}`);

        },
        onError: (error) => {
            toast.error(`Failed to publish recipe: ${error.message}`);
        }
    });

    const { mutate: updateRecipe, isPending: isUpdating } = api.recipe.update.useMutation({
        onSuccess: async (data) => {
            await utils.recipe.getAll.invalidate();
            toast.success("Recipe updated successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to update recipe: ${error.message}`);
        }
    });

    const { mutate: scrapeRecipe, isPending: isScraping } = api.scraper.scrapeRecipe.useMutation({
        onSuccess: (data) => {
            const markdown = toRecipeMarkdown(data);
            setRecipe(markdown);
            if (editorRef.current) {
                editorRef.current.setValue(markdown);
            }
            toast.success("Recipe imported successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to import recipe: ${error.message}`);
        }
    });

    const handlePasteUrl = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (!text.startsWith('http')) {
                toast.error("Clipboard content is not a valid URL");
                return;
            }
            scrapeRecipe({ url: text });
        } catch (error) {
            toast.error("Failed to read clipboard");
        }
    };

    const handlePublish = async () => {
        try {
            if (mode === 'edit' && initialRecipe) {
                await updateRecipe({
                    id: initialRecipe.id,
                    bookId: initialRecipe.bookId,
                    markdown: recipe,
                });
            } else {
                await createRecipe({
                    markdown: recipe,
                    bookId: bookId,
                });
            }
        } catch (error) {
        }
    };
    return (
        <ResizablePanelGroup direction="horizontal" className='h-full'>
            <ResizablePanel defaultSize={30}>
                {/* Editor Section */}
                <div className="h-screen flex flex-col ">
                    <RecipeEditor
                        ref={editorRef}
                        initialValue={recipe}
                        onChange={(value: string | undefined) => setRecipe(value ?? '')}
                    />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} >
                {/* Preview Section */}
                <div className="h-screen flex-1 flex flex-col overflow-scroll p-6 bg-white">                   
                     <RecipeComponent recipe={parseRecipe(recipe)} version={initialRecipe?.version ?? 1} />
                </div>
            </ResizablePanel>
            <FloatingActionButton>
                <div className='flex flex-col gap-2'>
                    <div className="text-sm text-neutral-400 mb-5">{mode === 'create' ? 'Publish' : 'Update'} recipe</div>
                    <div className='flex flex-row gap-2 justify-end'>
                        <Button variant="default" className='bg-green-700 hover:bg-green-600' onClick={handlePublish}>{mode === 'create' ? 'Publish' : 'Update'}</Button>
                        <Button variant="outline" onClick={() => {/* TODO: Save as draft */ }}>Save as Draft</Button>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className='text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 rounded-full' >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" side='top'> 
                                <DropdownMenuItem onClick={handlePasteUrl} disabled={isScraping}>
                                    <Link className="mr-2 h-4 w-4" />
                                    <span>Paste URL</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </FloatingActionButton>
        </ResizablePanelGroup>
    );
}