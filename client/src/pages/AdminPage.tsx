import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit2, Plus } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import { useLanguage } from "@/lib/LanguageContext";
import { translations, getProductName } from "@/lib/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    images: ["", "", "", ""] as string[], // up to 4 additional images
    category: "Food" as string,
    inStock: true,
    tags: "" as string, // comma-separated tags
  });

  // Fetch products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      // Combine primary image with additional images
      const allImages = [data.image, ...data.images.filter((img) => img.trim())];
      return await apiRequest("POST", "/api/admin/products", {
        ...data,
        images: allImages,
        price: parseFloat(data.price),
        tags,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: t.productCreated,
        description: t.productAddedSuccess,
      });
      resetForm();
      setShowAddForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || t.failedCreateProduct,
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      // Combine primary image with additional images
      const allImages = [data.image, ...data.images.filter((img) => img.trim())];
      return await apiRequest("PUT", `/api/admin/products/${editingId}`, {
        ...data,
        images: allImages,
        price: parseFloat(data.price),
        tags,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: t.productUpdated,
        description: t.productUpdatedSuccess,
      });
      resetForm();
      setEditingId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || t.failedUpdateProduct,
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/products/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: t.productDeleted,
        description: t.productDeletedSuccess,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || t.failedDeleteProduct,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      images: ["", "", "", ""],
      category: "Food",
      inStock: true,
      tags: "",
    });
  };

  const handleEdit = (product: Product) => {
    // First image is primary, rest are additional
    const [primary, ...additional] = product.images || [product.image];
    const additionalImages = [...additional, ...Array(4 - additional.length).fill("")].slice(0, 4);
    
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: primary || product.image,
      images: additionalImages,
      category: product.category,
      inStock: product.inStock,
      tags: (product.tags || []).join(", "),
    });
    setEditingId(product.id);
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      toast({
        title: t.validationError,
        description: t.fillAllFields,
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (["food", "nuts", "grains", "spices", "dried fruits", "organic products"].includes(cat)) {
      return "bg-green-100 text-green-800";
    }
    return "bg-amber-100 text-amber-800";
  };

  const categoryColor = getCategoryColor(formData.category);

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
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold mb-3 text-foreground">{t.inventoryManagement}</h1>
          <p className="text-muted-foreground text-lg">{t.organizeItems}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit Product Form */}
          <Card className="lg:col-span-1 p-8 h-fit sticky top-8 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg text-foreground">
                {editingId ? t.editItem : t.addNewItem}
              </h2>
              {editingId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingId(null);
                    resetForm();
                  }}
                  data-testid="button-cancel-edit"
                >
                  {t.cancel}
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t.productName} *</label>
                <Input
                  placeholder={t.exampleAlmonds}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-product-name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">{t.productDescription} *</label>
                <textarea
                  placeholder={t.exampleDescription}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  rows={3}
                  data-testid="input-product-description"
                />
              </div>

              <div>
                <label className="text-sm font-medium">{t.priceUsd} *</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t.examplePrice}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  data-testid="input-product-price"
                />
              </div>

              <div>
                <label className="text-sm font-medium">{t.imageUrls} *</label>
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder={`${t.mainImage} https://...`}
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    data-testid="input-product-image"
                  />
                  {formData.images.map((img, idx) => (
                    <Input
                      key={idx}
                      type="url"
                      placeholder={`${t.additionalImage} ${idx + 1} (optional) https://...`}
                      value={img}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[idx] = e.target.value;
                        setFormData({ ...formData, images: newImages });
                      }}
                      data-testid={`input-product-image-${idx + 2}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.imageHint}</p>
              </div>

              <div>
                <label className="text-sm font-medium">{t.category} *</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger data-testid="select-product-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Nuts">Nuts</SelectItem>
                    <SelectItem value="Grains">Grains</SelectItem>
                    <SelectItem value="Spices">Spices</SelectItem>
                    <SelectItem value="Dried Fruits">Dried Fruits</SelectItem>
                    <SelectItem value="Organic Products">Organic Products</SelectItem>
                    <SelectItem value="Cosmetics">Cosmetics</SelectItem>
                    <SelectItem value="Skincare">Skincare</SelectItem>
                    <SelectItem value="Supplements">Supplements</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{t.tags}</label>
                <Input
                  placeholder={t.exampleTags}
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  data-testid="input-product-tags"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  data-testid="checkbox-in-stock"
                />
                <label htmlFor="inStock" className="text-sm font-medium">
                  {t.inStock}
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-submit-product"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? t.saving
                  : editingId
                    ? t.updateProduct
                    : t.addProduct}
              </Button>
            </form>
          </Card>

          {/* Products Table */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-semibold text-xl text-foreground">📦 {t.itemList} ({products.length})</h2>
            </div>

            <div className="space-y-3">
              {products.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">{t.noProducts}</p>
                </Card>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row mb-4" data-testid={`card-product-${product.id}`}>
                    {/* Image Section: Big on mobile, fixed size on desktop */}
                    <div className="relative w-full h-56 md:w-48 md:h-auto shrink-0 bg-gray-100">
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
                            <h3 className="font-semibold text-base truncate" data-testid={`text-name-${product.id}`}>
                              {getProductName(product.name, language)}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-1">
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
                          <span className="text-lg font-bold" data-testid={`text-price-${product.id}`}>
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

                      {/* Action Buttons: Grid on mobile, Flex on desktop */}
                      <div className="grid grid-cols-2 gap-3 mt-5 md:flex md:justify-end md:mt-0">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex items-center justify-center w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700"
                          data-testid={`button-edit-${product.id}`}
                        >
                          <Edit2 className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">{t.edit}</span>
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(product.id)}
                          disabled={deleteMutation.isPending}
                          className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          data-testid={`button-delete-${product.id}`}
                        >
                          <Trash2 className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">{t.delete}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
