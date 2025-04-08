"use client";

import type { ThemeProviderProps } from "next-themes";

import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";
import { Toaster } from "sonner";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}


export function Providers({ children, themeProps }: ProvidersProps) {

  return (
    <TRPCReactProvider>
      <SessionProvider>
          <NextThemesProvider {...themeProps}>
            {children}
          <Toaster position="top-right" richColors closeButton />
          </NextThemesProvider>
      </SessionProvider>
    </TRPCReactProvider>
  );
}
