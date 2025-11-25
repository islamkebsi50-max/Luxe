import {
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
} from "@shared/schema";
import { IStorage } from "./storage";
import { getFirestoreDb } from "./firestore";
import { randomUUID } from "crypto";
import { uploadImageFromUrl } from "./imageUpload";

export class FirestoreStorage implements IStorage {
  private db = getFirestoreDb();

  private async ensureSeedData() {
    const productsRef = this.db.collection("products");
    const snapshot = await productsRef.limit(1).get();

    if (!snapshot.empty) {
      return;
    }

    const seedData: InsertProduct[] = [
      {
        name: "Premium Organic Almonds",
        description:
          "Delicious, nutrient-dense organic almonds sourced from premium farms. Raw and unsalted, perfect for snacking or cooking. Rich in protein, fiber, and healthy fats.",
        price: "18.99",
        originalPrice: "22.99",
        category: "Nuts",
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
        category: "Grains",
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
      {
        name: "Exotic Spice Blend",
        description:
          "A carefully crafted blend of 12 premium spices from around the world. Perfect for seasoning rice, vegetables, meat, and more. Hand-picked and freshly ground.",
        price: "14.99",
        originalPrice: "18.99",
        category: "Spices",
        image: "https://via.placeholder.com/400?text=Spices",
        images: [
          "https://via.placeholder.com/400?text=Spices",
          "https://via.placeholder.com/400?text=Spices",
          "https://via.placeholder.com/400?text=Spices",
          "https://via.placeholder.com/400?text=Spices",
        ],
        rating: "4.6",
        reviewCount: 203,
        inStock: true,
        featured: true,
        tags: ["Premium", "Organic"],
      },
      {
        name: "Naturally Sweet Dried Mango",
        description:
          "Sun-dried mango slices with no added sugar or preservatives. Sweet, chewy texture and vibrant tropical flavor. Great for snacking or adding to trail mix.",
        price: "9.99",
        originalPrice: null,
        category: "Dried Fruits",
        image: "https://via.placeholder.com/400?text=DriedMango",
        images: [
          "https://via.placeholder.com/400?text=DriedMango",
          "https://via.placeholder.com/400?text=DriedMango",
          "https://via.placeholder.com/400?text=DriedMango",
          "https://via.placeholder.com/400?text=DriedMango",
        ],
        rating: "4.9",
        reviewCount: 342,
        inStock: true,
        featured: true,
        tags: ["Sugar-Free", "Natural"],
      },
      {
        name: "Cold-Pressed Coconut Oil",
        description:
          "Virgin, cold-pressed coconut oil perfect for cooking, baking, or skincare. Unrefined and packed with natural antioxidants and MCTs.",
        price: "16.99",
        originalPrice: null,
        category: "Organic Products",
        image: "https://via.placeholder.com/400?text=CoconutOil",
        images: [
          "https://via.placeholder.com/400?text=CoconutOil",
          "https://via.placeholder.com/400?text=CoconutOil",
          "https://via.placeholder.com/400?text=CoconutOil",
          "https://via.placeholder.com/400?text=CoconutOil",
        ],
        rating: "4.8",
        reviewCount: 127,
        inStock: true,
        featured: false,
        tags: ["Organic", "Vegan", "Kosher"],
      },
      {
        name: "Natural Face Serum",
        description:
          "Lightweight, hydrating facial serum with natural plant extracts and antioxidants. Suitable for all skin types. Dermatologist tested and cruelty-free.",
        price: "32.99",
        originalPrice: "39.99",
        category: "Cosmetics",
        image: "https://via.placeholder.com/400?text=FaceSerum",
        images: [
          "https://via.placeholder.com/400?text=FaceSerum",
          "https://via.placeholder.com/400?text=FaceSerum",
          "https://via.placeholder.com/400?text=FaceSerum",
          "https://via.placeholder.com/400?text=FaceSerum",
        ],
        rating: "4.7",
        reviewCount: 234,
        inStock: true,
        featured: false,
        tags: ["Natural", "Skincare", "Cruelty-Free"],
      },
      {
        name: "Organic Vitamin D3 Supplements",
        description:
          "Premium vitamin D3 derived from sustainable lichen sources. Supports bone health and immune function. Vegan, gluten-free, and non-GMO.",
        price: "24.99",
        originalPrice: null,
        category: "Organic Products",
        image: "https://via.placeholder.com/400?text=VitaminD3",
        images: [
          "https://via.placeholder.com/400?text=VitaminD3",
          "https://via.placeholder.com/400?text=VitaminD3",
          "https://via.placeholder.com/400?text=VitaminD3",
          "https://via.placeholder.com/400?text=VitaminD3",
        ],
        rating: "4.9",
        reviewCount: 187,
        inStock: true,
        featured: true,
        tags: ["Vegan", "Gluten-Free", "Non-GMO"],
      },
      {
        name: "Premium Saffron Threads",
        description:
          "Grade A Kashmir saffron threads with exceptional aroma and golden hue. Perfect for paella, risotto, and traditional dishes. Authenticity guaranteed.",
        price: "45.99",
        originalPrice: null,
        category: "Spices",
        image: "https://via.placeholder.com/400?text=Saffron",
        images: [
          "https://via.placeholder.com/400?text=Saffron",
          "https://via.placeholder.com/400?text=Saffron",
          "https://via.placeholder.com/400?text=Saffron",
          "https://via.placeholder.com/400?text=Saffron",
        ],
        rating: "5.0",
        reviewCount: 95,
        inStock: true,
        featured: true,
        tags: ["Premium", "Authentic", "Gourmet"],
      },
      {
        name: "Creamy Almond Butter",
        description:
          "Smooth, creamy almond butter made from roasted organic almonds. No added sugars, oils, or preservatives. Perfect for smoothies, baking, and toast.",
        price: "11.99",
        originalPrice: "14.99",
        category: "Nuts",
        image: "https://via.placeholder.com/400?text=AlmondButter",
        images: [
          "https://via.placeholder.com/400?text=AlmondButter",
          "https://via.placeholder.com/400?text=AlmondButter",
          "https://via.placeholder.com/400?text=AlmondButter",
          "https://via.placeholder.com/400?text=AlmondButter",
        ],
        rating: "4.8",
        reviewCount: 267,
        inStock: true,
        featured: false,
        tags: ["Organic", "Natural", "Vegan"],
      },
    ];

    const batch = this.db.batch();
    for (const product of seedData) {
      const docRef = productsRef.doc(randomUUID());
      batch.set(docRef, {
        ...product,
        id: docRef.id,
      });
    }
    await batch.commit();
  }

  async getAllProducts(): Promise<Product[]> {
    await this.ensureSeedData();
    const snapshot = await this.db.collection("products").get();
    return snapshot.docs.map((doc) => doc.data() as Product);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const doc = await this.db.collection("products").doc(id).get();
    return doc.data() as Product | undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const processedProduct = {
      ...product,
      id,
    };

    await this.db.collection("products").doc(id).set(processedProduct);
    return processedProduct as Product;
  }

  async updateProduct(
    id: string,
    product: Partial<InsertProduct>
  ): Promise<Product | undefined> {
    await this.db.collection("products").doc(id).update(product);
    return this.getProductById(id);
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.db.collection("products").doc(id).delete();
    return true;
  }

  async getCartBySessionId(sessionId: string): Promise<CartItem[]> {
    const snapshot = await this.db
      .collection("cartItems")
      .where("sessionId", "==", sessionId)
      .get();
    return snapshot.docs.map((doc) => doc.data() as CartItem);
  }

  async getCartItemById(itemId: string): Promise<CartItem | undefined> {
    const doc = await this.db.collection("cartItems").doc(itemId).get();
    return doc.data() as CartItem | undefined;
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const cartItem = { ...item, id };
    await this.db.collection("cartItems").doc(id).set(cartItem);
    return cartItem as CartItem;
  }

  async updateCartItemQuantity(
    itemId: string,
    quantity: number
  ): Promise<CartItem | undefined> {
    await this.db.collection("cartItems").doc(itemId).update({ quantity });
    return this.getCartItemById(itemId);
  }

  async removeCartItem(itemId: string): Promise<boolean> {
    await this.db.collection("cartItems").doc(itemId).delete();
    return true;
  }

  async clearCart(sessionId: string): Promise<void> {
    const items = await this.getCartBySessionId(sessionId);
    const batch = this.db.batch();
    for (const item of items) {
      batch.delete(this.db.collection("cartItems").doc(item.id));
    }
    await batch.commit();
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const createdOrder = { ...order, id };
    await this.db.collection("orders").doc(id).set(createdOrder);
    return createdOrder as Order;
  }

  async getOrdersBySessionId(sessionId: string): Promise<Order[]> {
    const snapshot = await this.db
      .collection("orders")
      .where("sessionId", "==", sessionId)
      .get();
    return snapshot.docs.map((doc) => doc.data() as Order);
  }
}
