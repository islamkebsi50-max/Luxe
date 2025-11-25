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
    // Seeding disabled - products managed via admin panel only
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
