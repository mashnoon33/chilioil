import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { book: string } }
) {
  try {
    // Get total recipes count
    const totalRecipes = await db.recipe.count({
      where: { bookId: params.book },
    });

    // Get recent recipes with their metadata
    const recentRecipes = await db.recipe.findMany({
      where: { bookId: params.book },
      include: { metadata: true },
      orderBy: { updatedAt: "desc" },
      take: 6, // Show last 6 recipes
    });

    // Get last updated timestamp
    const lastUpdated = recentRecipes[0]?.updatedAt
      ? new Date(recentRecipes[0].updatedAt).toLocaleDateString()
      : "Never";

    return NextResponse.json({
      totalRecipes,
      recentRecipes,
      lastUpdated,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
} 