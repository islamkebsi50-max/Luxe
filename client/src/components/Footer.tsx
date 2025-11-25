import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

export function Footer() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
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
      title: t.shop,
      links: [
        { label: t.allProducts, href: "/products" },
        { label: t.newArrivals, href: "/products" },
        { label: t.bestSellers, href: "/products" },
        { label: t.sale, href: "/products" },
      ],
    },
    {
      title: t.support,
      links: [
        { label: t.contactUs, href: "#" },
        { label: t.shippingInfo, href: "#" },
        { label: t.returns, href: "#" },
        { label: t.faq, href: "#" },
      ],
    },
    {
      title: t.company,
      links: [
        { label: t.aboutUs, href: "#" },
        { label: t.careers, href: "#" },
        { label: t.sustainability, href: "#" },
        { label: t.press, href: "#" },
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
                {t.premiumProducts}
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
              {t.allRightsReserved}
            </p>
            <div className="flex gap-6">
              <button
                onClick={handlePrivacyClick}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                data-testid="button-privacy-policy"
              >
                {t.privacyPolicy}
              </button>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.termsOfService}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
