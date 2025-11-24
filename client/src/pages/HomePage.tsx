import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { BundleCard } from "@/components/BundleCard";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import type { Product } from "@shared/schema";
import heroImage1 from "@assets/generated_images/modern_living_room_hero.png";
import heroImage2 from "@assets/generated_images/urban_fashion_lifestyle_hero.png";

interface HomePageProps {
  products: Product[];
  onAddToCart: (productId: string | string[]) => void;
}

export function HomePage({ products, onAddToCart }: HomePageProps) {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<"food" | "cosmetic">("food");
  const heroImages = [heroImage1, heroImage2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const foodProducts = products.filter((p) => p.category.toLowerCase() === "food");
  const cosmeticProducts = products.filter((p) => p.category.toLowerCase() === "cosmetic");
  const displayProducts = selectedCategory === "food" ? foodProducts : cosmeticProducts;

  // Create featured bundles from available products
  const featuredBundles = [
    foodProducts.length > 0 && cosmeticProducts.length > 0
      ? {
          name: "Wellness Bundle",
          description: "Perfect pairing for your daily wellness routine",
          product1: foodProducts[0],
          product2: cosmeticProducts[0],
          discount: 15,
        }
      : null,
    foodProducts.length > 1 && cosmeticProducts.length > 1
      ? {
          name: "Luxury Essentials",
          description: "Curated collection of premium essentials",
          product1: foodProducts[1],
          product2: cosmeticProducts[1],
          discount: 12,
        }
      : null,
    foodProducts.length > 2
      ? {
          name: "Self-Care Combo",
          description: "Indulge yourself with these premium picks",
          product1: foodProducts[Math.min(2, foodProducts.length - 1)],
          product2: cosmeticProducts[Math.min(2, cosmeticProducts.length - 1)] || foodProducts[0],
          discount: 18,
        }
      : null,
  ].filter(Boolean) as Array<{
    name: string;
    description: string;
    product1: Product;
    product2: Product;
    discount: number;
  }>;

  const handleBundleAddToCart = (productIds: string[]) => {
    productIds.forEach((id) => onAddToCart(id));
  };

  const isFood = selectedCategory === "food";
  const toggleBgClass = isFood ? "bg-green-50 dark:bg-slate-900" : "bg-amber-50 dark:bg-slate-900";
  const activeButtonClass = isFood
    ? "bg-green-600 text-white hover:bg-green-700"
    : "bg-amber-600 text-white hover:bg-amber-700";
  const inactiveButtonClass = 
    "bg-background text-foreground border border-border hover-elevate";

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
              {isFood ? "Fresh & Natural" : "Beautiful & Pure"}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {isFood 
                ? "Discover our curated collection of premium food products"
                : "Explore our luxurious collection of cosmetic products"}
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

      {/* Category Toggle Section */}
      <section className={`py-20 border-b transition-colors ${toggleBgClass}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-3 text-foreground">Browse by Category</h2>
              <p className="text-muted-foreground text-lg">
                {isFood 
                  ? "Explore our collection of premium food items"
                  : "Discover our luxurious beauty and cosmetics"}
              </p>
            </div>
            
            {/* Toggle Buttons */}
            <div className="flex gap-3 p-1 rounded-lg border border-border bg-background">
              <Button
                className={`px-8 py-2 transition-all ${selectedCategory === "food" ? activeButtonClass : inactiveButtonClass}`}
                onClick={() => setSelectedCategory("food")}
                data-testid="button-toggle-food"
              >
                Food
              </Button>
              <Button
                className={`px-8 py-2 transition-all ${selectedCategory === "cosmetic" ? activeButtonClass : inactiveButtonClass}`}
                onClick={() => setSelectedCategory("cosmetic")}
                data-testid="button-toggle-cosmetics"
              >
                Cosmetics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground text-lg">No products available in this category</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Bundles Section */}
      {featuredBundles.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-bold mb-3 text-foreground">Featured Bundles</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Handpicked product combinations at incredible savings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBundles.map((bundle, index) => {
                const p1Price = parseFloat(bundle.product1.price);
                const p2Price = parseFloat(bundle.product2.price);
                const bundlePrice = (p1Price + p2Price) * (1 - bundle.discount / 100);
                
                return (
                  <BundleCard
                    key={`${bundle.product1.id}-${bundle.product2.id}`}
                    bundleName={bundle.name}
                    bundleDescription={bundle.description}
                    product1={bundle.product1}
                    product2={bundle.product2}
                    bundlePrice={bundlePrice}
                    discount={bundle.discount}
                    onAddToCart={handleBundleAddToCart}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Category Info Section */}
      <section className={`py-20 ${isFood ? "bg-green-50 dark:bg-slate-900" : "bg-amber-50 dark:bg-slate-900"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover-elevate transition-all" data-testid="card-info-1">
              <div className="text-5xl mb-4">{isFood ? "🥗" : "✨"}</div>
              <h3 className="font-semibold text-xl mb-3 text-foreground">{isFood ? "Premium Quality" : "Luxurious Care"}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {isFood 
                  ? "Hand-selected ingredients from trusted sources"
                  : "Formulated with natural and organic ingredients"}
              </p>
            </Card>
            <Card className="p-8 text-center hover-elevate transition-all" data-testid="card-info-2">
              <div className="text-5xl mb-4">{isFood ? "🚚" : "💝"}</div>
              <h3 className="font-semibold text-xl mb-3 text-foreground">Fast Delivery</h3>
              <p className="text-muted-foreground leading-relaxed">
                {isFood 
                  ? "Fresh delivery to your doorstep within 2-3 days"
                  : "Beautifully packaged and ready for gifting"}
              </p>
            </Card>
            <Card className="p-8 text-center hover-elevate transition-all" data-testid="card-info-3">
              <div className="text-5xl mb-4">✔️</div>
              <h3 className="font-semibold text-xl mb-3 text-foreground">Guaranteed Satisfaction</h3>
              <p className="text-muted-foreground leading-relaxed">
                100% satisfaction guarantee or your money back
              </p>
            </Card>
          </div>
        </div>
      </section>

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
