import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if roles exist, create if not
  await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user" },
  });

  await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());