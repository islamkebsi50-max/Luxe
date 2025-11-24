import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onSearchChange: (value: string) => void;
}

export function Header({ cartItemCount, onCartClick, onSearchChange }: HeaderProps) {
  const [location] = useLocation();

  const navLinks = [
    { label: "Home", href: "/", id: "home" },
    { label: "Food", href: "/products?category=food", id: "food" },
    { label: "Cosmetics", href: "/products?category=cosmetic", id: "cosmetics" },
  ];

  const getNavButtonClass = (href: string, id: string) => {
    const isActive = location === href || (href === "/" && location === "/");
    
    if (!isActive) {
      return "hover-elevate text-foreground";
    }

    // Active state styling based on category
    if (id === "food") {
      return "bg-green-600 text-white hover:bg-green-700 hover-elevate";
    } else if (id === "cosmetics") {
      return "bg-amber-600 text-white hover:bg-amber-700 hover-elevate";
    }
    
    return "hover-elevate text-foreground";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-2 mt-8">
                {navLinks.map((link) => {
                  const isActive = location === link.href || (link.href === "/" && location === "/");
                  let buttonClass = "w-full justify-start text-base hover-elevate";
                  
                  if (isActive && link.id === "food") {
                    buttonClass += " bg-green-600 text-white";
                  } else if (isActive && link.id === "cosmetics") {
                    buttonClass += " bg-amber-600 text-white";
                  }
                  
                  return (
                    <Link key={link.href} href={link.href}>
                      <Button
                        variant="ghost"
                        className={buttonClass}
                        data-testid={`link-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/">
            <h1 className="font-serif text-2xl font-bold cursor-pointer hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-logo">
              LUXE
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={getNavButtonClass(link.href, link.id)}
                  data-testid={`link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 bg-secondary/50 border-0 focus-visible:ring-primary"
                onChange={(e) => onSearchChange(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover-elevate text-foreground"
            onClick={onCartClick}
            data-testid="button-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full p-0 flex items-center justify-center text-xs"
                data-testid="badge-cart-count"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9 bg-secondary/50 border-0 focus-visible:ring-primary"
              onChange={(e) => onSearchChange(e.target.value)}
              data-testid="input-search-mobile"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
