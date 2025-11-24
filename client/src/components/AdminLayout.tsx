import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <Link href="/admin">
            <h1 className="font-serif text-2xl font-bold hover-elevate cursor-pointer" data-testid="link-admin-logo">
              Admin
            </h1>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link href="/admin">
            <Button
              variant={location === "/admin" ? "default" : "ghost"}
              className="w-full justify-start hover-elevate"
              data-testid="link-admin-dashboard"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full justify-start hover-elevate"
              data-testid="link-back-to-store"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
