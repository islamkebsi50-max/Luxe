import {
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  products,
  cartItems,
  orders,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Image paths for seed data
const headphonesImg = "/attached_assets/generated_images/premium_wireless_headphones_product.png";
const watchImg = "/attached_assets/generated_images/luxury_minimalist_wristwatch_product.png";
const sneakersImg = "/attached_assets/generated_images/modern_athletic_sneakers_product.png";
const backpackImg = "/attached_assets/generated_images/modern_minimalist_backpack_product.png";
const sunglassesImg = "/attached_assets/generated_images/luxury_sunglasses_product_shot.png";
const mugImg = "/attached_assets/generated_images/minimalist_ceramic_coffee_mug.png";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Cart
  getCartBySessionId(sessionId: string): Promise<CartItem[]>;
  getCartItemById(itemId: string): Promise<CartItem | undefined>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(itemId: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersBySessionId(sessionId: string): Promise<Order[]>;
}

export class DatabaseStorage implements IStorage {
  async ensureSeedData() {
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length > 0) {
      return;
    }

    const seedData: InsertProduct[] = [
      {
        name: "Premium Wireless Headphones",
        description: "Experience unparalleled sound quality with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and premium materials for all-day comfort. Perfect for music lovers and professionals alike.",
        price: "299.99",
        originalPrice: "399.99",
        category: "Electronics",
        image: headphonesImg,
        images: [headphonesImg, headphonesImg, headphonesImg, headphonesImg],
        rating: "4.8",
        reviewCount: 127,
        inStock: true,
        featured: true,
      },
      {
        name: "Luxury Minimalist Watch",
        description: "Timeless elegance meets modern craftsmanship. This minimalist watch features a premium leather strap, sapphire crystal glass, and Swiss movement. A perfect accessory for any occasion.",
        price: "449.99",
        originalPrice: null,
        category: "Accessories",
        image: watchImg,
        images: [watchImg, watchImg, watchImg, watchImg],
        rating: "4.9",
        reviewCount: 89,
        inStock: true,
        featured: true,
      },
      {
        name: "Modern Athletic Sneakers",
        description: "Designed for performance and style. These sneakers combine cutting-edge comfort technology with a sleek, modern aesthetic. Perfect for workouts, running, or casual wear.",
        price: "129.99",
        originalPrice: "159.99",
        category: "Fashion",
        image: sneakersImg,
        images: [sneakersImg, sneakersImg, sneakersImg, sneakersImg],
        rating: "4.6",
        reviewCount: 203,
        inStock: true,
        featured: true,
      },
      {
        name: "Minimalist Travel Backpack",
        description: "Your perfect travel companion. Features multiple compartments, water-resistant material, padded laptop sleeve, and ergonomic design. Sleek enough for the office, durable enough for adventures.",
        price: "89.99",
        originalPrice: null,
        category: "Accessories",
        image: backpackImg,
        images: [backpackImg, backpackImg, backpackImg, backpackImg],
        rating: "4.7",
        reviewCount: 156,
        inStock: true,
        featured: false,
      },
      {
        name: "Designer Sunglasses",
        description: "Protect your eyes in style with these designer sunglasses. Premium UV protection, lightweight metal frame, and timeless design. Includes premium carrying case and cleaning cloth.",
        price: "199.99",
        originalPrice: "249.99",
        category: "Accessories",
        image: sunglassesImg,
        images: [sunglassesImg, sunglassesImg, sunglassesImg, sunglassesImg],
        rating: "4.5",
        reviewCount: 78,
        inStock: true,
        featured: false,
      },
      {
        name: "Ceramic Coffee Mug",
        description: "Start your mornings right with this beautifully crafted ceramic mug. Minimalist design, perfect weight, and heat-retaining properties. Microwave and dishwasher safe.",
        price: "24.99",
        originalPrice: null,
        category: "Home & Living",
        image: mugImg,
        images: [mugImg, mugImg, mugImg, mugImg],
        rating: "4.8",
        reviewCount: 342,
        inStock: true,
        featured: true,
      },
    ];

    await db.insert(products).values(seedData);
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    await this.ensureSeedData();
    return await db.select().from(products);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  // Cart
  async getCartBySessionId(sessionId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async getCartItemById(itemId: string): Promise<CartItem | undefined> {
    const [item] = await db.select().from(cartItems).where(eq(cartItems.id, itemId));
    return item || undefined;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.sessionId, insertItem.sessionId),
          eq(cartItems.productId, insertItem.productId)
        )
      );

    if (existingItem) {
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + insertItem.quantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updated;
    }

    const [cartItem] = await db.insert(cartItems).values(insertItem).returning();
    return cartItem;
  }

  async updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem | undefined> {
    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, itemId))
      .returning();
    return updated || undefined;
  }

  async removeCartItem(itemId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, itemId)).returning();
    return result.length > 0;
  }

  async clearCart(sessionId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    await this.clearCart(insertOrder.sessionId);
    return order;
  }

  async getOrdersBySessionId(sessionId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
