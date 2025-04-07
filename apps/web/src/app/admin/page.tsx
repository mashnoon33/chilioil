"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export default function Page() {


  const { data: books, isLoading } = api.book.getAll.useQuery();

  const router = useRouter();

  useEffect(() => {
    if (books && books.length > 0) {
      router.push(`/admin/${books[0]?.id}`);
    }
  }, [books, router]);

  if (isLoading) {
    return null;
  }
  return (

    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>

  )
}
