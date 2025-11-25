import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ImageUploadCard({
  imagePreview,
  onImageSelect,
  label,
  subtitle,
}: {
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  label: string;
  subtitle: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        const input = fileInputRef.current;
        if (input) {
          input.dataset.preview = preview;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        data-testid={`input-${label}`}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group min-h-[160px]"
      >
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="text-sm font-bold text-gray-700">{label}</div>
            <div className="text-xs text-gray-500">{subtitle}</div>
          </>
        )}
      </button>
    </div>
  );
}

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
    category: "food" as string,
    inStock: true,
    tags: "" as string, // comma-separated tags
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [, setLocation] = useLocation();

  // Fetch products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Load product from URL parameter for editing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");
    
    if (editId && products.length > 0) {
      const product = products.find((p) => p.id === editId);
      if (product) {
        setEditingId(editId);
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          image: product.image,
          category: product.category,
          inStock: product.inStock,
          tags: product.tags.join(", "),
        });
        setImagePreview(product.image);
      }
    }
  }, [products]);

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      return await apiRequest("POST", "/api/admin/products", {
        ...data,
        images: [data.image],
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
      return await apiRequest("PUT", `/api/admin/products/${editingId}`, {
        ...data,
        images: [data.image],
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
      category: "food",
      inStock: true,
      tags: "",
    });
    setImagePreview(null);
    setImageBase64("");
  };

  const handleImageFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setImagePreview(base64String);
      setImageBase64(base64String);
      setFormData((prev) => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setImageBase64("");
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleEdit = (product: Product) => {
    const primaryImage = product.images?.[0] || product.image;
    
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: primaryImage,
      category: product.category.toLowerCase(),
      inStock: product.inStock,
      tags: (product.tags || []).join(", "),
    });
    setImagePreview(primaryImage);
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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Navigation */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-3 text-foreground">{t.addNewItem}</h1>
            <p className="text-muted-foreground text-lg">{t.organizeItems}</p>
          </div>
          <Button
            onClick={() => setLocation("/admin-inventory")}
            variant="outline"
            data-testid="button-view-inventory"
          >
            {t.itemList}
          </Button>
        </div>

        {/* Add/Edit Product Form */}
        <Card className="p-8 rounded-xl">
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
                  className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground"
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
                <label className="text-sm font-medium mb-3 block">{t.imageUrls} *</label>
                <div className="relative max-w-sm">
                  <ImageUploadCard
                    imagePreview={imagePreview}
                    onImageSelect={handleImageFileSelect}
                    label={t.mainImage}
                    subtitle={t.uploadSubtitle}
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={clearImagePreview}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
                      data-testid="button-clear-image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-3">{t.imageHint}</p>
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
                    <SelectItem value="Nuts">{t.nuts}</SelectItem>
                    <SelectItem value="Grains">{t.grains}</SelectItem>
                    <SelectItem value="Spices">{t.spices}</SelectItem>
                    <SelectItem value="Dried Fruits">{t.driedFruits}</SelectItem>
                    <SelectItem value="Organic Products">{t.organicProducts}</SelectItem>
                    <SelectItem value="Cosmetics">{t.cosmetics}</SelectItem>
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
      </div>
    </div>
  );
}
