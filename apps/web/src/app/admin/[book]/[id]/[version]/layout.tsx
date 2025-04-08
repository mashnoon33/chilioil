"use client";

import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { api } from "@/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { MoreHorizontal, Lock, Unlock, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RecipeVersionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const router = useRouter();
    const version = parseInt(params.version as string);
    const { data: recipe } = api.recipe.listVersions.useQuery({
        id: params.id as string,
        bookId: params.book as string,
    });

    return (
        <div className="h-screen flex flex-col relative overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
            <div className="flex-1">
                {children}
            </div>
            {recipe && recipe.length > 0 && (
                <FloatingActionButton className="min-h-10">
                    <div>
                        {recipe.map(r => (
                            <div
                                key={r.version}
                                className={`group p-3 cursor-pointer border border-neutral-900 hover:bg-neutral-800 bg-transparent rounded-md transition-colors mb-2 ${version === r.version ? " bg-gradient-to-r from-green-900/70 to-red-900/70" : ""}`}
                                onClick={() => router.push(`/admin/${params.book}/${params.id}/${r.version}`)}
                            >
                                <div className="flex flex-row justify-between items-center">
                                    <div>
                                        <div className="text-sm font-medium text-neutral-200">Version {r.version}</div>
                                        <div className="text-xs text-neutral-400 mt-1">
                                            {formatDistanceToNow(new Date(r.createdAt))} ago
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-neutral-200 focus:text-neutral-200 hover:bg-gray-700 rounded-md">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Lock className="mr-2 h-4 w-4" />
                                                <span>Make Private</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Unlock className="mr-2 h-4 w-4" />
                                                <span>Make Public</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete Version</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </FloatingActionButton>
            )}
        </div>
    );
}
