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
        name: "Premium Organic Almonds",
        description: "Delicious, nutrient-dense organic almonds sourced from premium farms. Raw and unsalted, perfect for snacking or cooking. Rich in protein, fiber, and healthy fats.",
        price: "18.99",
        originalPrice: "22.99",
        category: "Nuts",
        image: mugImg,
        images: [mugImg, mugImg, mugImg, mugImg],
        rating: "4.8",
        reviewCount: 156,
        inStock: true,
        featured: true,
        tags: ["Organic", "Raw", "Natural"],
      },
      {
        name: "Golden Flax Seeds",
        description: "Premium quality golden flax seeds packed with omega-3 fatty acids and fiber. Perfect for smoothies, salads, or baking. Non-GMO and certified organic.",
        price: "12.99",
        originalPrice: null,
        category: "Grains",
        image: mugImg,
        images: [mugImg, mugImg, mugImg, mugImg],
        rating: "4.7",
        reviewCount: 89,
        inStock: true,
        featured: true,
        tags: ["Organic", "Vegan", "High-Fiber"],
      },
      {
        name: "Exotic Spice Blend",
        description: "A carefully crafted blend of 12 premium spices from around the world. Perfect for seasoning rice, vegetables, meat, and more. Hand-picked and freshly ground.",
        price: "14.99",
        originalPrice: "18.99",
        category: "Spices",
        image: mugImg,
        images: [mugImg, mugImg, mugImg, mugImg],
        rating: "4.6",
        reviewCount: 203,
        inStock: true,
        featured: true,
        tags: ["Premium", "Organic"],
      },
      {
        name: "Naturally Sweet Dried Mango",
        description: "Sun-dried mango slices with no added sugar or preservatives. Sweet, chewy texture and vibrant tropical flavor. Great for snacking or adding to trail mix.",
        price: "9.99",
        originalPrice: null,
        category: "Dried Fruits",
        image: mugImg,
        images: [mugImg, mugImg, mugImg, mugImg],
        rating: "4.9",
        reviewCount: 342,
        inStock: true,
        featured: true,
        tags: ["Sugar-Free", "Natural"],
      },
      {
        name: "Cold-Pressed Coconut Oil",
        description: "Virgin, cold-pressed coconut oil perfect for cooking, baking, or skincare. Unrefined and packed with natural antioxidants and MCTs.",
        price: "16.99",
        originalPrice: null,
        category: "Organic Products",
        image: mugImg,
        images: [mugImg, mugImg, mugImg, mugImg],
        rating: "4.8",
        reviewCount: 127,
        inStock: true,
        featured: false,
        tags: ["Organic", "Vegan", "Kosher"],
      },
      {
        name: "Natural Face Serum",
        description: "Lightweight, hydrating facial serum with natural plant extracts and antioxidants. Suitable for all skin types. Dermatologist tested and cruelty-free.",
        price: "32.99",
        originalPrice: "39.99",
        category: "Skincare",
        image: mugImg,
        images: [mugImg, mugImg, mugImg, mugImg],
        rating: "4.7",
        reviewCount: 78,
        inStock: true,
        featured: false,
        tags: ["Cruelty-Free", "Natural"],
      },
      {
        name: "Organic Vitamin D3 Supplements",
        description: "Premium vitamin D3 derived from lanolin. Supports immune system and bone health. 2000 IU per capsule, 120 capsules per bottle.",
        price: "24.99",
        originalPrice: null,
        category: "Supplements",
        image: mugImg,
        images: [mugImg, mugImg, mugImg, mugImg],
        rating: "4.8",
        reviewCount: 456,
        inStock: true,
        featured: true,
        tags: ["Organic", "Non-GMO"],
      },
      {
        name: "Premium Saffron Threads",
        description: "Authentic hand-harvested saffron threads from premium sources. Vibrant red color and distinctive aroma. Perfect for biryanis, risottos, and special dishes.",
        price: "28.99",
        originalPrice: "34.99",
        category: "Spices",
        image: mugImg,
        images: [mugImg, mugImg, mugImg, mugImg],
        rating: "4.9",
        reviewCount: 234,
        inStock: true,
        featured: false,
        tags: ["Premium", "Organic"],
      },
      {
        name: "Creamy Almond Butter",
        description: "Smooth, creamy almond butter made from roasted almonds. No added oils, sugar, or salt. Perfect for smoothies, toast, or snacking straight from the jar.",
        price: "11.99",
        originalPrice: null,
        category: "Nuts",
        image: mugImg,
        images: [mugImg, mugImg, mugImg, mugImg],
        rating: "4.7",
        reviewCount: 345,
        inStock: true,
        featured: false,
        tags: ["Organic", "Vegan", "All-Natural"],
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
