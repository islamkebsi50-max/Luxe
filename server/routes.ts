import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import type { IStorage } from "./storage";
import { insertCartItemSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import { randomUUID } from "crypto";
import { MemoryStorage } from "./memoryStorage";
import multer from "multer";
import { uploadImageToImgbb } from "./imageUpload";

const upload = multer({ storage: multer.memoryStorage() });

let storage: IStorage;

async function initializeStorage() {
  // Try to use Firestore if configured, otherwise fall back to memory storage
  const hasFirebaseConfig = process.env.FIREBASE_PROJECT_ID;
  
  if (hasFirebaseConfig) {
    try {
      const { FirestoreStorage } = await import("./firestoreStorage");
      storage = new FirestoreStorage();
    } catch (error) {
      console.warn("Failed to initialize Firestore, falling back to memory storage");
      storage = new MemoryStorage();
    }
  } else {
    // Use memory storage by default in development
    storage = new MemoryStorage();
  }
}

const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(99, "Quantity cannot exceed 99"),
});

const updateQuantitySchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(99, "Quantity cannot exceed 99"),
});

function getOrCreateSession(req: Request, res: Response): string {
  let sessionId = req.cookies?.sessionId;
  
  if (!sessionId) {
    sessionId = randomUUID();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
  
  return sessionId;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize storage before registering routes
  await initializeStorage();
  // Products
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Cart
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = getOrCreateSession(req, res);
      const cartItems = await storage.getCartBySessionId(sessionId);
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return { ...item, product };
        })
      );
      res.json(itemsWithProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = addToCartSchema.parse(req.body);
      const sessionId = getOrCreateSession(req, res);
      const { productId, quantity } = validatedData;
      
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      if (!product.inStock) {
        return res.status(400).json({ error: "Product is out of stock" });
      }

      const currentCart = await storage.getCartBySessionId(sessionId);
      const existingCartItem = currentCart.find(item => item.productId === productId);
      const totalQuantity = existingCartItem ? existingCartItem.quantity + quantity : quantity;

      if (totalQuantity > 99) {
        return res.status(400).json({ error: "Cannot add more than 99 items of the same product" });
      }
      
      const cartItem = await storage.addToCart({ sessionId, productId, quantity });
      res.json({ ...cartItem, product });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid cart item data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:itemId", async (req, res) => {
    try {
      const validatedData = updateQuantitySchema.parse(req.body);
      const sessionId = getOrCreateSession(req, res);

      const existingItem = await storage.getCartItemById(req.params.itemId);
      if (!existingItem || existingItem.sessionId !== sessionId) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      const updatedItem = await storage.updateCartItemQuantity(req.params.itemId, validatedData.quantity);
      const product = await storage.getProductById(updatedItem!.productId);
      res.json({ ...updatedItem, product });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid quantity", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:itemId", async (req, res) => {
    try {
      const sessionId = getOrCreateSession(req, res);
      
      const existingItem = await storage.getCartItemById(req.params.itemId);
      if (!existingItem || existingItem.sessionId !== sessionId) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      const success = await storage.removeCartItem(req.params.itemId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const sessionId = getOrCreateSession(req, res);
      const { shippingName, shippingEmail, shippingAddress, shippingCity, shippingZip, shippingCountry } = req.body;
      
      const cartItems = await storage.getCartBySessionId(sessionId);
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
            name: product.name,
          };
        })
      );

      const subtotal = itemsWithProducts.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );
      const shipping = subtotal > 100 ? 0 : 10;
      const tax = subtotal * 0.1;
      const total = (subtotal + shipping + tax).toFixed(2);

      const orderData = {
        sessionId,
        items: JSON.stringify(itemsWithProducts),
        total,
        shippingName,
        shippingEmail,
        shippingAddress,
        shippingCity,
        shippingZip,
        shippingCountry,
      };

      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const sessionId = getOrCreateSession(req, res);
      const orders = await storage.getOrdersBySessionId(sessionId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Admin routes
  const createProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    image: z.string().min(1, "Image URL is required"),
    category: z.enum(["food", "cosmetic"]),
    inStock: z.boolean().default(true),
  });

  app.post("/api/admin/products", async (req, res) => {
    try {
      const validatedData = createProductSchema.parse(req.body);
      const product = await storage.createProduct({
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price.toString(),
        image: validatedData.image,
        images: [validatedData.image],
        category: validatedData.category,
        inStock: validatedData.inStock,
        rating: "4.5",
        reviewCount: 0,
        featured: false,
      });
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const validatedData = createProductSchema.partial().parse(req.body);
      const updates: Record<string, any> = {};
      
      if (validatedData.name) updates.name = validatedData.name;
      if (validatedData.description) updates.description = validatedData.description;
      if (validatedData.price !== undefined) updates.price = validatedData.price.toString();
      if (validatedData.image) {
        updates.image = validatedData.image;
        updates.images = [validatedData.image];
      }
      if (validatedData.category) updates.category = validatedData.category;
      if (validatedData.inStock !== undefined) updates.inStock = validatedData.inStock;

      const product = await storage.updateProduct(req.params.id, updates);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Image upload endpoint - file upload
  app.post("/api/admin/upload-image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const fileName = `product-${Date.now()}-${req.file.originalname}`;
      const uploadedUrl = await uploadImageToImgbb(req.file.buffer, fileName);
      res.json({ url: uploadedUrl });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
