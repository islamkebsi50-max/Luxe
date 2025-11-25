import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HomePage } from "@/pages/HomePage";
import { ProductListingPage } from "@/pages/ProductListingPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { AdminPage } from "@/pages/AdminPage";
import { AdminLayout } from "@/components/AdminLayout";
import NotFound from "@/pages/not-found";
import type { Product, CartItem } from "@shared/schema";
import { apiRequest } from "./lib/queryClient";
import { LanguageProvider } from "@/lib/LanguageContext";

function AppContent() {
  const [location, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();


  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: cartItems = [] } = useQuery<Array<CartItem & { product: Product }>>({
    queryKey: ["/api/cart"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      return await apiRequest("POST", "/api/cart", { productId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return await apiRequest("PATCH", `/api/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return await apiRequest("DELETE", `/api/cart/${itemId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Order placed!",
        description: "Your order has been successfully placed",
      });
    },
  });

  const handleAddToCart = (productId: string, quantity = 1) => {
    addToCartMutation.mutate({ productId, quantity });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateQuantityMutation.mutate({ itemId, quantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemMutation.mutate(itemId);
  };

  const handlePlaceOrder = (orderData: any) => {
    placeOrderMutation.mutate(orderData);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (location !== "/products") {
      setLocation("/products");
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const categoryFilter = urlParams.get("category") || "";

  return (
    <>
      <Switch>
        {/* Secret Admin Routes - Hidden paths */}
        <Route path="/admin-panel-secret">
          <AdminLayout>
            <AdminPage />
          </AdminLayout>
        </Route>
        <Route path="/admin">
          <AdminLayout>
            <AdminPage />
          </AdminLayout>
        </Route>

        {/* Customer Routes */}
        <Route>
          <div className="flex flex-col min-h-screen">
            <Header
              cartItemCount={cartItems.length}
              onCartClick={() => setCartOpen(true)}
            onSearchChange={handleSearchChange}
          />

          <main className="flex-1">
            <Switch>
              <Route path="/">
                <HomePage products={products} onAddToCart={handleAddToCart} />
              </Route>

              <Route path="/products">
                <ProductListingPage
                  products={products}
                  onAddToCart={handleAddToCart}
                  searchQuery={searchQuery}
                  categoryFilter={categoryFilter}
                />
              </Route>

              <Route path="/products/:id">
                {(params) => {
                  const product = products.find((p) => p.id === params.id);
                  if (!product) return <NotFound />;

                  const relatedProducts = products
                    .filter((p) => p.category === product.category && p.id !== product.id)
                    .slice(0, 4);

                  return (
                    <ProductDetailPage
                      product={product}
                      relatedProducts={relatedProducts}
                      onAddToCart={handleAddToCart}
                    />
                  );
                }}
              </Route>

              <Route path="/checkout">
                <CheckoutPage cartItems={cartItems} onPlaceOrder={handlePlaceOrder} />
              </Route>

              <Route component={NotFound} />
            </Switch>
          </main>

          <Footer />

          <CartDrawer
            open={cartOpen}
            onOpenChange={setCartOpen}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </Route>
    </Switch>
    <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}
