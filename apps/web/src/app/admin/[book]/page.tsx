"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Table } from "lucide-react";
import { RecipeCard } from "@/components/recipe-card";
export default function AdminBookPage() {
  const params = useParams();
  const [view, setView] = useState<"cards" | "table">("cards");
  const { data, isLoading } = api.admin.getDashboardData.useQuery({
    bookId: params.book as string,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className=" px-4 py-8">
   
      
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Card className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.totalRecipes || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">All recipes in your book</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.lastUpdated || "Never"}</p>
            <p className="text-sm text-muted-foreground mt-1">Most recent activity</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.recentRecipes?.length || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">New recipes added</p>
          </CardContent>
        </Card>
      </div>

      {/* Recipes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Recipes</h2>
          <div className="flex items-center gap-4">
            <Tabs value={view} onValueChange={(v) => setView(v as "cards" | "table")}>
              <TabsList>
                <TabsTrigger value="cards" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Cards
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </button>
          </div>
        </div>

        {view === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.recentRecipes?.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} currentRoute={`/admin/${params.book}`} />
            ))}
          </div>
        ) : (
          <DataTable columns={columns} data={data?.recentRecipes || []} />
        )}
      </div>
    </div>
  );
}
