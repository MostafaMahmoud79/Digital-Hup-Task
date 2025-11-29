"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar";
import LogoutBtn from "./_components/logout-btn";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "@/components/ui/badge";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col md:flex-row w-full">
        {/* Sidebar */}
        <Sidebar className="w-full md:w-[250px] lg:w-[300px] flex flex-col p-3 gap-3">
          <SidebarHeader>
            <div className="space-y-2">
              <div className="capitalize font-bold text-lg lg:text-xl">
                Admin Dashboard
              </div>
              {user && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{user.email}</span>
                  <Badge variant="secondary" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="flex-1 flex flex-col gap-3">
            <Link
              href="/dashboard"
              className={`p-3 rounded cursor-pointer hover:bg-sidebar-accent transition text-sm lg:text-base ${
                pathname.includes("/projects")
                  ? "bg-sidebar-accent font-medium"
                  : ""
              }`}
            >
              Projects
            </Link>
          </SidebarContent>

          <div className="mt-auto">
            <LogoutBtn />
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 w-full">
          <div className="md:hidden p-4 border-b flex items-center justify-between">
            <SidebarTrigger />
            <span className="font-semibold text-sm">Dashboard</span>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
