import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SEED_SLUGS = [
  "oversized-tee-noir",
  "hoodie-123-creme",
  "cargo-pant-wide",
  "jacket-denim-123",
  "tee-logo-gold",
];

async function main() {
  // 1. Trouver les produits concernés
  const products = await prisma.product.findMany({
    where: { slug: { in: SEED_SLUGS } },
    select: { id: true },
  });
  const ids = products.map(p => p.id);

  // 2. Supprimer les OrderItems liés
  const { count: itemsDeleted } = await prisma.orderItem.deleteMany({
    where: { productId: { in: ids } },
  });
  console.log(`✅ ${itemsDeleted} OrderItem(s) supprimé(s)`);

  // 3. Supprimer les produits
  const { count: productsDeleted } = await prisma.product.deleteMany({
    where: { id: { in: ids } },
  });
  console.log(`✅ ${productsDeleted} produit(s) supprimé(s)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());