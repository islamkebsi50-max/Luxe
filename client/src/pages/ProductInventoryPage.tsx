import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit2, Plus } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import { useLanguage } from "@/lib/LanguageContext";
import { translations, getProductName } from "@/lib/translations";
import { useLocation } from "wouter";

export function ProductInventoryPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await apiRequest("DELETE", `/api/admin/products/${productId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: t.productDeleted,
        description: t.productDeletedSuccess,
      });
    },
    onError: () => {
      toast({
        title: t.failedDeleteProduct,
        variant: "destructive",
      });
    },
  });

  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (["food", "nuts", "grains", "spices", "dried fruits", "organic products"].includes(cat)) {
      return "bg-green-100 text-green-800";
    }
    return "bg-amber-100 text-amber-800";
  };

  // Calculate inventory stats
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;
  const foodCount = products.filter((p) => 
    ["food", "nuts", "grains", "spices", "dried fruits", "organic products"].includes(p.category.toLowerCase())
  ).length;
  const cosmeticCount = products.filter((p) => 
    ["cosmetics", "skincare", "supplements"].includes(p.category.toLowerCase())
  ).length;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-3 text-foreground">{t.itemList}</h1>
            <p className="text-muted-foreground text-lg">{t.organizeItems}</p>
          </div>
          <Button
            onClick={() => setLocation("/admin-panel-secret")}
            variant="outline"
            data-testid="button-back-to-admin"
          >
            {t.backToStore}
          </Button>
        </div>

        {/* Inventory Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <Card className="p-6 text-center hover-elevate transition-all">
            <div className="text-3xl font-bold text-foreground mb-1">{totalProducts}</div>
            <div className="text-sm text-muted-foreground">{t.totalItems}</div>
          </Card>
          <Card className="p-6 text-center hover-elevate transition-all">
            <div className="text-3xl font-bold text-green-600 mb-1">{inStockCount}</div>
            <div className="text-sm text-muted-foreground">{t.inStock}</div>
          </Card>
          <Card className="p-6 text-center hover-elevate transition-all">
            <div className="text-3xl font-bold text-red-600 mb-1">{outOfStockCount}</div>
            <div className="text-sm text-muted-foreground">{t.outOfStock}</div>
          </Card>
          <Card className="p-6 text-center hover-elevate transition-all">
            <div className="text-3xl font-bold text-green-600 mb-1">{foodCount}</div>
            <div className="text-sm text-muted-foreground">{t.foodItems}</div>
          </Card>
          <Card className="p-6 text-center hover-elevate transition-all">
            <div className="text-3xl font-bold text-amber-600 mb-1">{cosmeticCount}</div>
            <div className="text-sm text-muted-foreground">{t.cosmetics}</div>
          </Card>
        </div>

        {/* Products List */}
        <div>
          <div className="space-y-3">
            {isLoading ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">{t.noProducts}</p>
              </Card>
            ) : products.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">{t.noProducts}</p>
                <Button
                  onClick={() => setLocation("/admin-panel-secret")}
                  data-testid="button-add-first-product"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addProduct}
                </Button>
              </Card>
            ) : (
              products.map((product) => (
                <Card key={product.id} className="overflow-hidden flex flex-col md:flex-row hover-elevate transition-all" data-testid={`card-product-${product.id}`}>
                  {/* Image Section */}
                  <div className="relative w-full h-56 md:w-48 md:h-auto shrink-0 bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      data-testid={`img-product-${product.id}`}
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col flex-1 p-5 md:p-4">
                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base truncate text-foreground" data-testid={`text-name-${product.id}`}>
                            {getProductName(product.name, language)}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                        <Badge
                          className={`flex-shrink-0 ${getCategoryColor(product.category)}`}
                          data-testid={`badge-category-${product.id}`}
                        >
                          {product.category}
                        </Badge>
                      </div>

                      {/* Price and Stock */}
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-bold text-foreground" data-testid={`text-price-${product.id}`}>
                          د.ج {product.price}
                        </span>
                        <Badge
                          variant={product.inStock ? "default" : "destructive"}
                          data-testid={`badge-stock-${product.id}`}
                        >
                          {product.inStock ? t.inStock : t.outOfStock}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-5 md:flex md:gap-2 md:justify-end md:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/admin-panel-secret?edit=${product.id}`)}
                        data-testid={`button-edit-${product.id}`}
                        className="w-full md:w-auto"
                      >
                        <Edit2 className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">{t.edit}</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(product.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${product.id}`}
                        className="w-full md:w-auto"
                      >
                        <Trash2 className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">{t.delete}</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
