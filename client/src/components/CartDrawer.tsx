import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import type { Product, CartItem } from "@shared/schema";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: Array<CartItem & { product: Product }>;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function CartDrawer({
  open,
  onOpenChange,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const { language } = useLanguage();
  const t = translations[language];
  
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background" data-testid="drawer-cart">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6" />
            <SheetTitle className="text-2xl font-serif">{t.shoppingCart}</SheetTitle>
            {cartItems.length > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} {t.items}
              </span>
            )}
          </div>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{t.yourCartEmpty}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t.addSomeProducts}
              </p>
              <Link href="/products">
                <Button 
                  onClick={() => onOpenChange(false)} 
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-continue-shopping"
                >
                  {t.continueShopping}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items Scrollable Area */}
            <div className="flex-1 overflow-y-auto py-6 border-t space-y-3 pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-card/80 transition-colors"
                  data-testid={`cart-item-${item.id}`}
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1 truncate text-foreground" data-testid={`text-cart-item-name-${item.id}`}>
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      ${parseFloat(item.product.price).toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-muted rounded-md w-fit p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-background"
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-semibold" data-testid={`text-quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-background"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-sm text-foreground" data-testid={`text-item-total-${item.id}`}>
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Sticky Bottom */}
            <div className="border-t bg-background pt-6 space-y-4">
              {/* Pricing Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.subtotal}</span>
                  <span className="font-medium" data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.shipping}</span>
                  <span className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`} data-testid="text-shipping">
                    {shipping === 0 ? t.free : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal > 0 && subtotal < 100 && (
                  <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span className="text-foreground">{t.total}</span>
                  <span className="text-primary text-lg" data-testid="text-total">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="block">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-base active-elevate-2"
                  onClick={() => onOpenChange(false)}
                  data-testid="button-checkout"
                >
                  {t.checkout}
                </Button>
              </Link>

              {/* Continue Shopping */}
              <Link href="/products" className="block">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                  data-testid="button-continue-shopping-drawer"
                >
                  {t.continueShopping}
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
