const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const centers = await prisma.bloodCenter.findMany();
  console.log(centers);
}

main().finally(() => prisma.$disconnect());
