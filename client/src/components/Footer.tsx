import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

export function Footer() {
  const [, setLocation] = useLocation();
  const [privacyClickCount, setPrivacyClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Clear existing timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    const newCount = privacyClickCount + 1;
    setPrivacyClickCount(newCount);

    // If 7 clicks reached, go to admin dashboard
    if (newCount === 7) {
      setLocation("/admin-panel-secret");
      setPrivacyClickCount(0);
      return;
    }

    // Reset count after 3 seconds of no clicking
    const timeout = setTimeout(() => {
      setPrivacyClickCount(0);
    }, 3000);

    setClickTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  const footerSections = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/products" },
        { label: "New Arrivals", href: "/products" },
        { label: "Best Sellers", href: "/products" },
        { label: "Sale", href: "/products" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "#" },
        { label: "Shipping Info", href: "#" },
        { label: "Returns", href: "#" },
        { label: "FAQ", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Sustainability", href: "#" },
        { label: "Press", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">LUXE</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium products with modern design and timeless quality. Elevate your everyday.
              </p>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>
                        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 LUXE. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button
                onClick={handlePrivacyClick}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                data-testid="button-privacy-policy"
              >
                Privacy Policy
              </button>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
