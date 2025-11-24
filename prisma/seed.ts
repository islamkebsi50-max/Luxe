import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing products
  await prisma.products.deleteMany();

  // Food products
  const foodProducts = await prisma.products.createMany({
    data: [
      {
        name: "Organic Almonds",
        description: "Premium organic almonds, freshly roasted and perfectly salted",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1585968412613-186efb1fce9f?w=400&h=400&fit=crop",
        images: ["https://images.unsplash.com/photo-1585968412613-186efb1fce9f?w=400&h=400&fit=crop"],
        category: "food",
        in_stock: true,
      },
      {
        name: "Wild Blueberries",
        description: "Fresh wild blueberries harvested from mountain regions",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1585518419759-e9ddfb98e37e?w=400&h=400&fit=crop",
        images: ["https://images.unsplash.com/photo-1585518419759-e9ddfb98e37e?w=400&h=400&fit=crop"],
        category: "food",
        in_stock: true,
      },
      {
        name: "Honey Gold Raw Honey",
        description: "100% pure raw honey from local beekeepers",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1609859482156-eaaa6478c6e9?w=400&h=400&fit=crop",
        images: ["https://images.unsplash.com/photo-1609859482156-eaaa6478c6e9?w=400&h=400&fit=crop"],
        category: "food",
        in_stock: true,
      },
      {
        name: "Artisan Coffee Beans",
        description: "Single-origin coffee beans roasted to perfection",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400&h=400&fit=crop",
        images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400&h=400&fit=crop"],
        category: "food",
        in_stock: true,
      },
      {
        name: "Extra Virgin Olive Oil",
        description: "Cold-pressed extra virgin olive oil from Mediterranean olives",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1618164436241-92473500ef45?w=400&h=400&fit=crop",
        images: ["https://images.unsplash.com/photo-1618164436241-92473500ef45?w=400&h=400&fit=crop"],
        category: "food",
        in_stock: true,
      },
    ],
  });

  // Cosmetic products
  const cosmeticProducts = await prisma.products.createMany({
    data: [
      {
        name: "Hydrating Face Serum",
        description: "Lightweight hydrating serum with hyaluronic acid and vitamin C",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1570194065650-d99fb6b06d61?w=400&h=400&fit=crop",
        images: ["https://images.unsplash.com/photo-1570194065650-d99fb6b06d61?w=400&h=400&fit=crop"],
        category: "cosmetic",
        in_stock: true,
      },
      {
        name: "Natural Lip Balm",
        description: "Organic lip balm with natural moisturizing oils and SPF 15",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1576502400694-f1b0dcc6fb11?w=400&h=400&fit=crop",
        images: ["https://images.unsplash.com/photo-1576502400694-f1b0dcc6fb11?w=400&h=400&fit=crop"],
        category: "cosmetic",
        in_stock: true,
      },
      {
        name: "Bamboo Charcoal Face Mask",
        description: "Deep cleansing face mask with activated bamboo charcoal",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1596231476866-84f3fd6d10da?w=400&h=400&fit=crop",
        images: ["https://images.unsplash.com/photo-1596231476866-84f3fd6d10da?w=400&h=400&fit=crop"],
        category: "cosmetic",
        in_stock: true,
      },
      {
        name: "Silk Sleep Pillowcase",
        description: "Premium silk pillowcase for hair and skin health",
        price: 44.99,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
        images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"],
        category: "cosmetic",
        in_stock: true,
      },
      {
        name: "Rose Petal Night Cream",
        description: "Nourishing night cream with rose petals and plant extracts",
        price: 28.99,
        image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e83?w=400&h=400&fit=crop",
        images: ["https://images.unsplash.com/photo-1599599810694-b5ac4dd37e83?w=400&h=400&fit=crop"],
        category: "cosmetic",
        in_stock: true,
      },
    ],
  });

  console.log("Seeding completed!");
  console.log(`Created ${foodProducts.count} food products`);
  console.log(`Created ${cosmeticProducts.count} cosmetic products`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
