import { HydrateClient } from "@/trpc/server";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function Home() {
  const books = await api.book.getAllPublic()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <div className="container py-8 font-mono whitespace-pre">
          {`
   ######  ##     ## ######## ######## ##        #######   ######  
  ##       ##     ## ##       ##       ##       ##     ## ##    ## 
  ##       ##     ## ##       ##       ##       ##     ## ##       
  ##       ######### ######   ######   ##       ##     ## ##   ####
  ##       ##     ## ##       ##       ##       ##     ## ##    ## 
  ##       ##     ## ##       ##       ##       ##     ## ##    ## 
   ######  ##     ## ######## ##       ########  #######   ######  
          `}
        </div>
        <div className="pl-4 gap-2 font-mono flex flex-col">
          {books.map((book) => (
            <Link href={`/${book.id}`} className="hover:underline">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>

                {book.id}
              </span>
            </Link>
          ))}
        </div>
        <div className="container mt-auto p-4 mb-5  font-mono whitespace-pre">
                <Link href="/admin" className="hover:underline">
                <span className="flex items-center gap-2">

                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>

                Admin
            </span>

            </Link>

        </div>
      </main>
    </HydrateClient>
  );
}
