import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertOrderSchema } from "@shared/schema";
import { Check, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import type { Product, CartItem } from "@shared/schema";
import { z } from "zod";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

interface CheckoutPageProps {
  cartItems: Array<CartItem & { product: Product }>;
  onPlaceOrder: (orderData: z.infer<typeof checkoutFormSchema>) => void;
}

const checkoutFormSchema = insertOrderSchema.omit({ sessionId: true, items: true, total: true }).extend({
  email: z.string().email("Invalid email address"),
});

export function CheckoutPage({ cartItems, onPlaceOrder }: CheckoutPageProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [orderPlaced, setOrderPlaced] = useState(false);

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingName: "",
      shippingEmail: "",
      shippingAddress: "",
      shippingCity: "",
      shippingZip: "",
      shippingCountry: "",
    },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const onSubmit = (data: z.infer<typeof checkoutFormSchema>) => {
    onPlaceOrder(data);
    setOrderPlaced(true);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t.yourCartEmpty}</h2>
            <p className="text-muted-foreground mb-6">
              {t.addSomeProducts}
            </p>
            <Link href="/products">
              <Button data-testid="button-shop-now">{t.continueShopping}</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-2" data-testid="text-order-success">
              {t.orderPlaced}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t.orderPlacedMsg}
            </p>
            <div className="space-y-3">
              <Link href="/products">
                <Button className="w-full" data-testid="button-continue-shopping">
                  {t.continueShopping}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full hover-elevate" data-testid="button-home">
                  {t.backToHome}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold mb-8" data-testid="text-checkout-title">
          {t.checkoutTitle}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">{t.shippingInformation}</h2>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="shippingName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                data-testid="input-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shippingEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                {...field}
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shippingAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main St"
                                {...field}
                                data-testid="input-address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="shippingCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="New York"
                                  {...field}
                                  data-testid="input-city"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shippingZip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="10001"
                                  {...field}
                                  data-testid="input-zip"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="shippingCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="United States"
                                {...field}
                                data-testid="input-country"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    data-testid="button-place-order"
                  >
                    Place Order - ${total.toFixed(2)}
                  </Button>
                </form>
              </Form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3" data-testid={`order-item-${item.id}`}>
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium text-sm">
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span data-testid="text-checkout-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span data-testid="text-checkout-shipping">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span data-testid="text-checkout-tax">${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span data-testid="text-checkout-total">${total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal > 0 && subtotal < 100 && (
                <p className="text-xs text-muted-foreground mt-4">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
