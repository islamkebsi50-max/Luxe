import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import type { Product } from "@shared/schema";
import heroImage1 from "@assets/generated_images/modern_living_room_hero.png";
import heroImage2 from "@assets/generated_images/urban_fashion_lifestyle_hero.png";

interface HomePageProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
}

export function HomePage({ products, onAddToCart }: HomePageProps) {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const heroImages = [heroImage1, heroImage2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const categories = [
    { name: "Electronics", count: products.filter((p) => p.category === "Electronics").length },
    { name: "Accessories", count: products.filter((p) => p.category === "Accessories").length },
    { name: "Fashion", count: products.filter((p) => p.category === "Fashion").length },
    { name: "Home & Living", count: products.filter((p) => p.category === "Home & Living").length },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden bg-muted">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHeroIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10" />
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6" data-testid="text-hero-title">
              Elevate Your Everyday
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Discover our curated collection of premium products designed for modern living.
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 active-elevate-2"
                data-testid="button-shop-now"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentHeroIndex ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
              onClick={() => setCurrentHeroIndex(index)}
              data-testid={`button-hero-indicator-${index}`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.name} href={`/products?category=${encodeURIComponent(category.name)}`}>
                <Card className="p-8 text-center hover-elevate cursor-pointer" data-testid={`card-category-${category.name}`}>
                  <h3 className="font-semibold text-xl mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} products</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-serif text-4xl font-bold mb-2">Featured Products</h2>
                <p className="text-muted-foreground">Handpicked selections just for you</p>
              </div>
              <Link href="/products">
                <Button variant="outline" className="hover-elevate" data-testid="button-view-all">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <h2 className="font-serif text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-lg mb-8 opacity-90">
            Subscribe to get special offers, free giveaways, and exclusive deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              data-testid="input-newsletter"
            />
            <Button
              className="bg-white text-primary hover:bg-white/90 active-elevate-2"
              data-testid="button-subscribe"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
