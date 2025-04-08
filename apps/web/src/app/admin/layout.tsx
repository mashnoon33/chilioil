"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AuthModal } from "@/components/modals/auth-modal";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    
    useEffect(() => {
      if (pathname?.endsWith('/create') || pathname?.endsWith('/edit')) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }, [pathname]);
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset >
        <AuthModal />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
