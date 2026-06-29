const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    data: { role: 'ADMIN' },
  });
  console.log("All users are now ADMINs.");
}

main().finally(() => prisma.$disconnect());
