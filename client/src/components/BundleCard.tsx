import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Zap } from "lucide-react";
import type { Product } from "@shared/schema";

interface BundleCardProps {
  bundleName: string;
  bundleDescription: string;
  product1: Product;
  product2: Product;
  bundlePrice: number;
  discount: number;
  onAddToCart: (productIds: string[]) => void;
}

export function BundleCard({
  bundleName,
  bundleDescription,
  product1,
  product2,
  bundlePrice,
  discount,
  onAddToCart,
}: BundleCardProps) {
  const individualPrice =
    parseFloat(product1.price) + parseFloat(product2.price);
  const savings = individualPrice - bundlePrice;
  const discountPercent = Math.round((savings / individualPrice) * 100);

  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg hover-elevate transition-all bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Header with Discount Badge */}
      <div className="relative p-8 pb-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
              {bundleName}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {bundleDescription}
            </p>
          </div>
          <Badge className="bg-red-500 text-white flex-shrink-0 ml-4">
            <Zap className="h-3 w-3 mr-1" />
            Save {discountPercent}%
          </Badge>
        </div>
      </div>

      {/* Products Display */}
      <div className="px-8 py-6 flex gap-6">
        {/* Product 1 */}
        <div className="flex-1 text-center">
          <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-white">
            <img
              src={product1.image}
              alt={product1.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-semibold text-sm text-foreground truncate">
            {product1.name}
          </p>
          <p className="text-xs text-muted-foreground">
            ${product1.price}
          </p>
        </div>

        {/* Plus Sign */}
        <div className="flex items-center">
          <div className="text-2xl font-bold text-muted-foreground">+</div>
        </div>

        {/* Product 2 */}
        <div className="flex-1 text-center">
          <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-white">
            <img
              src={product2.image}
              alt={product2.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-semibold text-sm text-foreground truncate">
            {product2.name}
          </p>
          <p className="text-xs text-muted-foreground">
            ${product2.price}
          </p>
        </div>
      </div>

      {/* Pricing and Button */}
      <div className="px-8 pb-8 pt-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground line-through">
              ${individualPrice.toFixed(2)}
            </p>
            <p className="text-3xl font-bold text-foreground">
              ${bundlePrice.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-600 font-semibold">
              You save ${savings.toFixed(2)}
            </p>
          </div>
        </div>

        <Button
          onClick={() => onAddToCart([product1.id, product2.id])}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          data-testid={`button-buy-bundle-${product1.id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Buy Bundle
        </Button>
      </div>
    </Card>
  );
}
