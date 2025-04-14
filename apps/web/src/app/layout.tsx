import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { Providers } from "@/app/provider";
export const metadata: Metadata = {
  title: "cheflog",
  description: "cheflog",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <script 
        defer 
        src="/scripts/umami.js" 
        data-website-id="14cdd8d8-a746-47a6-b05c-c5484b0d8100"
        data-host-url="https://cloud.umami.is"
      ></script>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
