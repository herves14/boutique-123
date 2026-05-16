import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  // ADMIN
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@boutique123.com" },
    update: {},
    create: {
      email: "admin@boutique123.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin créé — admin@boutique123.com / admin123");

  // CATÉGORIES
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "t-shirts" },
      update: {},
      create: { name: "T-Shirts", slug: "t-shirts" },
    }),
    prisma.category.upsert({
      where: { slug: "hoodies" },
      update: {},
      create: { name: "Hoodies", slug: "hoodies" },
    }),
    prisma.category.upsert({
      where: { slug: "pantalons" },
      update: {},
      create: { name: "Pantalons", slug: "pantalons" },
    }),
    prisma.category.upsert({
      where: { slug: "vestes" },
      update: {},
      create: { name: "Vestes", slug: "vestes" },
    }),
  ]);
  console.log("✅ Catégories créées");

  // PRODUITS
  const products = [
    {
      name: "Oversized Tee Noir",
      slug: "oversized-tee-noir",
      description: "T-shirt oversize en coton premium. Coupe urbaine et décontractée.",
      price: 12500,
      stock: 50,
      images: [],
      isNew: true,
      isFeatured: false,
      categoryId: categories[0].id,
      sizes: ["S", "M", "L", "XL"] as any,
    },
    {
      name: "Hoodie 123 Crème",
      slug: "hoodie-123-creme",
      description: "Hoodie signature avec logo brodé. Matière épaisse et confortable.",
      price: 22000,
      stock: 30,
      images: [],
      isNew: true,
      isFeatured: true,
      categoryId: categories[1].id,
      sizes: ["S", "M", "L", "XL", "XXL"] as any,
    },
    {
      name: "Cargo Pant Wide",
      slug: "cargo-pant-wide",
      description: "Pantalon cargo wide leg avec poches latérales. Style streetwear.",
      price: 28000,
      stock: 25,
      images: [],
      isNew: false,
      isFeatured: true,
      categoryId: categories[2].id,
      sizes: ["S", "M", "L", "XL"] as any,
    },
    {
      name: "Jacket Denim 123",
      slug: "jacket-denim-123",
      description: "Veste en denim stonewashed avec patch 123. Pièce forte de la collection.",
      price: 35000,
      stock: 15,
      images: [],
      isNew: true,
      isFeatured: true,
      categoryId: categories[3].id,
      sizes: ["S", "M", "L"] as any,
    },
    {
      name: "Tee Logo Gold",
      slug: "tee-logo-gold",
      description: "T-shirt avec logo doré imprimé. Édition limitée.",
      price: 15000,
      stock: 40,
      images: [],
      isNew: true,
      isFeatured: false,
      categoryId: categories[0].id,
      sizes: ["XS", "S", "M", "L", "XL"] as any,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log("✅ Produits créés");

  console.log("🎉 Seed terminé !");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());