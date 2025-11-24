import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
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

  return (
    <Card className="group overflow-hidden hover-elevate transition-all" data-testid={`card-product-${product.id}`}>
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-product-${product.id}`}
          />
          {hasDiscount && (
            <Badge
              variant="destructive"
              className="absolute top-3 right-3"
              data-testid={`badge-discount-${product.id}`}
            >
              -{discountPercent}%
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-6 space-y-4">
        <Link href={`/products/${product.id}`}>
          <div>
            <p className={`text-xs font-semibold mb-2 px-2 py-1 rounded w-fit ${badgeColor}`}>
              {product.category}
            </p>
            <h3 className="font-semibold text-lg leading-tight text-foreground hover:text-primary transition-colors" data-testid={`text-product-name-${product.id}`}>
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
              ${product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <Button
          className={`w-full ${buttonColor} hover-elevate active-elevate-2 transition-colors`}
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product.id);
          }}
          disabled={!product.inStock}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </Card>
  );
}
