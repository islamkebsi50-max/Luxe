import { Link } from "wouter";

export function Footer() {
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
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
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
