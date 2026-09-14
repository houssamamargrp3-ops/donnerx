const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/donnerx?schema=public";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    }
  });

  console.log("=== ALL REGISTERED USERS ===");
  console.log(JSON.stringify(users, null, 2));

  // Default admin info
  const adminEmail = "admin@donnerx.com";
  const defaultPassword = "AdminPassword123!";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const newAdmin = await prisma.user.create({
      data: {
        name: "مدير النظام",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
        isActive: true,
      }
    });
    console.log("\nCreated default admin:", newAdmin.email);
  } else {
    const updated = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: "ADMIN",
        password: hashedPassword,
        isActive: true,
        isVerified: true,
      }
    });
    console.log("\nUpdated admin user credentials:", updated.email);
  }

  // Also promote any other admin users or show them
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, email: true, name: true, role: true }
  });
  console.log("\n=== ADMIN USERS ===");
  console.log(JSON.stringify(admins, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
