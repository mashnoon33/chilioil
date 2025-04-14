import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <div className="container m-auto py-8 text-4xl font-bold">
            cheflog
        </div>
      </main>
    </HydrateClient>
  );
}

