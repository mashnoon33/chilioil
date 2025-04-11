import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { Providers } from "@/app/provider";
export const metadata: Metadata = {
  title: "Chilioil",
  description: "Chilioil",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <script defer src="https://cloud.umami.is/script.js" data-website-id="14cdd8d8-a746-47a6-b05c-c5484b0d8100"></script>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
