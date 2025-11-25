import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { useLanguage } from "@/lib/LanguageContext";
import { translations, getTagName, getCategoryName } from "@/lib/translations";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { language } = useLanguage();
  const t = translations[language];
  
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  const isFoodCategory = product.category.toLowerCase() === "food";
  const badgeColor = isFoodCategory
    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
    : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100";
  const buttonColor = isFoodCategory 
    ? "bg-green-600 hover:bg-green-700 text-white"
    : "bg-amber-600 hover:bg-amber-700 text-white";
  const shadowClass = isFoodCategory ? "shadow-sm hover:shadow-md" : "shadow-md hover:shadow-lg";

  return (
    <Card 
      className={`group overflow-hidden rounded-xl hover-elevate transition-all ${shadowClass}`} 
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted rounded-t-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            data-testid={`img-product-${product.id}`}
          />
          {hasDiscount && (
            <Badge
              variant="destructive"
              className="absolute top-4 right-4"
              data-testid={`badge-discount-${product.id}`}
            >
              -{discountPercent}%
            </Badge>
          )}
          
          {/* Tags Badges */}
          {product.tags && product.tags.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge
                  key={`${product.id}-tag-${index}`}
                  className="bg-blue-500 text-white text-xs px-2 py-1 truncate"
                  data-testid={`badge-tag-${product.id}-${index}`}
                >
                  {getTagName(tag, language)}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="p-6 space-y-4">
        <Link href={`/products/${product.id}`}>
          <div>
            <p className={`text-xs font-semibold mb-2 px-3 py-1 rounded-md w-fit ${badgeColor}`}>
              {getCategoryName(product.category, language)}
            </p>
            <h3 className="font-semibold text-lg leading-tight text-foreground hover:text-primary transition-colors line-clamp-2" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h3>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground" data-testid={`text-price-${product.id}`}>
              د.ج {product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                د.ج {product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <Button
          className={`w-full ${buttonColor} hover-elevate active-elevate-2 transition-colors rounded-lg`}
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product.id);
          }}
          disabled={!product.inStock}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? t.addToCart : t.outOfStock}
        </Button>
      </div>
    </Card>
  );
}
