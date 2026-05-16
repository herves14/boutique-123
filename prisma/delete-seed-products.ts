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
  const { count } = await prisma.product.deleteMany({
    where: { slug: { in: SEED_SLUGS } },
  });
  console.log(`✅ ${count} produit(s) supprimé(s)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());