import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b p-4 flex items-center justify-between">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          data-testid="button-sidebar-toggle"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        <h1 className="font-serif text-xl font-bold">{t.admin}</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
          data-testid="overlay-sidebar"
        />
      )}

      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen w-64 border-r bg-card/80 backdrop-blur-sm flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-8 border-b bg-background/50 hidden md:block">
          <Link href="/admin">
            <h1
              className="font-serif text-2xl font-bold text-foreground hover-elevate cursor-pointer transition-colors"
              data-testid="link-admin-logo"
            >
              {t.admin}
            </h1>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-3">
          <Link href="/admin">
            <Button
              variant={location === "/admin" ? "default" : "ghost"}
              className="w-full justify-start hover-elevate text-foreground"
              data-testid="link-admin-dashboard"
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {t.dashboard}
            </Button>
          </Link>
        </nav>

        <div className="p-6 border-t">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full justify-start hover-elevate text-foreground"
              data-testid="link-back-to-store"
              onClick={() => setSidebarOpen(false)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t.backToStore}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background w-full md:w-auto pt-20 md:pt-0">
        {children}
      </main>
    </div>
  );
}
