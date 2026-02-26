"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, CalendarDays, LogOut } from "lucide-react";

import { useAuthStore } from "../../store/auth";
import { Button } from "../../components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, user, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !token) {
      router.push("/login");
    }
  }, [isMounted, token, router]);

  if (!isMounted || !token) {
    return null; // Return null while checking auth to avoid hydration mismatch
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b font-bold text-xl tracking-tight">
          Evently Admin
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/events">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Events
            </Button>
          </Link>
        </nav>

        <div className="px-4 py-6 border-t">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium leading-none">{user?.email}</p>
            <p className="text-xs text-muted-foreground mt-1">Org Owner</p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full p-8">{children}</div>
      </main>
    </div>
  );
}
