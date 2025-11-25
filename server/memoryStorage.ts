import {
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
} from "@shared/schema";
import { IStorage } from "./storage";
import { randomUUID } from "crypto";

export class MemoryStorage implements IStorage {
  private products: Map<string, Product> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private orders: Map<string, Order> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    const seedProducts: InsertProduct[] = [
      {
        name: "Premium Organic Almonds",
        description:
          "Delicious, nutrient-dense organic almonds sourced from premium farms. Raw and unsalted, perfect for snacking or cooking. Rich in protein, fiber, and healthy fats.",
        price: "18.99",
        originalPrice: "22.99",
        category: "food",
        image: "https://via.placeholder.com/400?text=Almonds",
        images: [
          "https://via.placeholder.com/400?text=Almonds",
          "https://via.placeholder.com/400?text=Almonds",
          "https://via.placeholder.com/400?text=Almonds",
          "https://via.placeholder.com/400?text=Almonds",
        ],
        rating: "4.8",
        reviewCount: 156,
        inStock: true,
        featured: true,
        tags: ["Organic", "Raw", "Natural"],
      },
      {
        name: "Golden Flax Seeds",
        description:
          "Premium quality golden flax seeds packed with omega-3 fatty acids and fiber. Perfect for smoothies, salads, or baking. Non-GMO and certified organic.",
        price: "12.99",
        originalPrice: null,
        category: "food",
        image: "https://via.placeholder.com/400?text=FlaxSeeds",
        images: [
          "https://via.placeholder.com/400?text=FlaxSeeds",
          "https://via.placeholder.com/400?text=FlaxSeeds",
          "https://via.placeholder.com/400?text=FlaxSeeds",
          "https://via.placeholder.com/400?text=FlaxSeeds",
        ],
        rating: "4.7",
        reviewCount: 89,
        inStock: true,
        featured: true,
        tags: ["Organic", "Vegan", "High-Fiber"],
      },
    ];

    seedProducts.forEach((product) => {
      const id = randomUUID();
      this.products.set(id, {
        id,
        ...product,
      } as Product);
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = {
      id,
      ...product,
    } as Product;
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(
    id: string,
    updates: Partial<InsertProduct>
  ): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updated = { ...product, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getCartBySessionId(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
  }

  async getCartItemById(itemId: string): Promise<CartItem | undefined> {
    return this.cartItems.get(itemId);
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const newItem: CartItem = {
      id,
      ...item,
    } as CartItem;
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItemQuantity(
    itemId: string,
    quantity: number
  ): Promise<CartItem | undefined> {
    const item = this.cartItems.get(itemId);
    if (!item) return undefined;

    const updated = { ...item, quantity };
    this.cartItems.set(itemId, updated);
    return updated;
  }

  async removeCartItem(itemId: string): Promise<boolean> {
    return this.cartItems.delete(itemId);
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToDelete: string[] = [];
    this.cartItems.forEach((item, id) => {
      if (item.sessionId === sessionId) {
        itemsToDelete.push(id);
      }
    });
    itemsToDelete.forEach((id) => this.cartItems.delete(id));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      id,
      ...order,
    } as Order;
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrdersBySessionId(sessionId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.sessionId === sessionId
    );
  }
}
