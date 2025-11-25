import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, Search, X } from "lucide-react";
import type { Product } from "@shared/schema";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

interface ProductListingPageProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  searchQuery?: string;
  categoryFilter?: string;
}

export function ProductListingPage({
  products,
  onAddToCart,
  searchQuery = "",
  categoryFilter = "",
}: ProductListingPageProps) {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryFilter ? [categoryFilter] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const maxPrice = Math.max(...products.map((p) => parseFloat(p.price)));

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Use local search query if available, otherwise use passed search query
    const activeSearchQuery = localSearchQuery || searchQuery;
    
    if (activeSearchQuery) {
      const query = activeSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "rating":
        sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      default:
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return sorted;
  }, [products, searchQuery, localSearchQuery, selectedCategories, priceRange, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleClearSearch = () => {
    setLocalSearchQuery("");
  };

  const hasActiveFilters = localSearchQuery || selectedCategories.length > 0 || priceRange[1] < maxPrice;

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4 text-foreground">{t.categories}</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                data-testid={`checkbox-category-${category}`}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-normal cursor-pointer text-foreground"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-foreground">{t.priceRange}</h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={maxPrice}
            step={10}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            data-testid="slider-price-range"
          />
          <div className="flex items-center justify-between text-sm text-foreground font-medium">
            <span data-testid="text-min-price">${priceRange[0].toFixed(0)}</span>
            <span data-testid="text-max-price">${priceRange[1].toFixed(0)}</span>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full hover-elevate"
          onClick={() => {
            setLocalSearchQuery("");
            setSelectedCategories([]);
            setPriceRange([0, maxPrice]);
          }}
          data-testid="button-clear-filters"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  const activeSearch = localSearchQuery || searchQuery;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold mb-2 text-foreground" data-testid="text-page-title">
            {activeSearch ? `Search results for "${activeSearch}"` : "All Products"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Main Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search by product name or description..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-12 pr-10 py-6 text-base rounded-lg border-2 focus-visible:ring-2 focus-visible:ring-primary"
              data-testid="input-product-search"
            />
            {localSearchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-clear-search"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-6">Filters</h2>
              <FilterContent />
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 bg-card rounded-lg border">
              {/* Mobile & Tablet Filters Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="lg:hidden hover-elevate w-full sm:w-auto" 
                    data-testid="button-open-filters"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {t.filters}
                    {hasActiveFilters && <span className="ml-2 text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded-full">Active</span>}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>{t.filters}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium hidden sm:inline">{t.sortBy}</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-56" data-testid="select-sort">
                    <SelectValue placeholder={t.sortBy} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">{t.featured}</SelectItem>
                    <SelectItem value="price-low">{t.priceLowToHigh}</SelectItem>
                    <SelectItem value="price-high">{t.priceHighToLow}</SelectItem>
                    <SelectItem value="rating">{t.rating}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-lg text-muted-foreground mb-4">{t.noProducts}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, maxPrice]);
                  }}
                  data-testid="button-reset-filters"
                >
                  Reset Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
