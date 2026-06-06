import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import path from "path";

const dbUrl = `file:${path.resolve(process.cwd(), "dev.db")}`;
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding...");

  // Admin user
  const hashed = await bcrypt.hash("admin1234", 12);
  await prisma.user.upsert({
    where: { email: "admin@figus.ar" },
    update: {},
    create: {
      email: "admin@figus.ar",
      password: hashed,
      name: "Admin",
      lastName: "Figus",
      emailVerified: true,
      role: "ADMIN",
    },
  });
  console.log("✓ Admin: admin@figus.ar / admin1234");

  // Test user
  const hashedUser = await bcrypt.hash("user1234", 12);
  await prisma.user.upsert({
    where: { email: "juan@test.ar" },
    update: {},
    create: {
      email: "juan@test.ar",
      password: hashedUser,
      name: "Juan",
      lastName: "Pérez",
      emailVerified: true,
      role: "USER",
    },
  });
  console.log("✓ Usuario: juan@test.ar / user1234");

  // Figuritas
  const figuritas = [
    { number: 1, name: "Lionel Messi", team: "Argentina", rarity: "LEGENDARIA", price: 2500, stock: 5 },
    { number: 2, name: "Julián Álvarez", team: "Argentina", rarity: "EPICA", price: 1500, stock: 8 },
    { number: 3, name: "Rodrigo De Paul", team: "Argentina", rarity: "RARA", price: 800, stock: 12 },
    { number: 4, name: "Emiliano Martínez", team: "Argentina", rarity: "EPICA", price: 1200, stock: 6 },
    { number: 5, name: "Ángel Di María", team: "Argentina", rarity: "RARA", price: 900, stock: 10 },
    { number: 6, name: "Lautaro Martínez", team: "Argentina", rarity: "EPICA", price: 1100, stock: 7 },
    { number: 7, name: "Nicolás Otamendi", team: "Argentina", rarity: "POCO_COMUN", price: 500, stock: 15 },
    { number: 8, name: "Leandro Paredes", team: "Argentina", rarity: "POCO_COMUN", price: 450, stock: 18 },
    { number: 9, name: "Marcos Acuña", team: "Argentina", rarity: "COMUN", price: 300, stock: 25 },
    { number: 10, name: "Cristian Romero", team: "Argentina", rarity: "POCO_COMUN", price: 550, stock: 14 },
    { number: 11, name: "Exequiel Palacios", team: "Argentina", rarity: "COMUN", price: 250, stock: 30 },
    { number: 12, name: "Thiago Almada", team: "Argentina", rarity: "COMUN", price: 200, stock: 35 },
    { number: 13, name: "Erling Haaland", team: "Noruega", rarity: "LEGENDARIA", price: 2000, stock: 4 },
    { number: 14, name: "Kylian Mbappé", team: "Francia", rarity: "LEGENDARIA", price: 2200, stock: 3 },
    { number: 15, name: "Vinicius Jr.", team: "Brasil", rarity: "EPICA", price: 1400, stock: 6 },
    { number: 16, name: "Rodri", team: "España", rarity: "RARA", price: 750, stock: 11 },
    { number: 17, name: "Jude Bellingham", team: "Inglaterra", rarity: "EPICA", price: 1300, stock: 7 },
    { number: 18, name: "Pedri", team: "España", rarity: "RARA", price: 700, stock: 13 },
    { number: 19, name: "Bukayo Saka", team: "Inglaterra", rarity: "POCO_COMUN", price: 480, stock: 16 },
    { number: 20, name: "Phil Foden", team: "Inglaterra", rarity: "POCO_COMUN", price: 460, stock: 17 },
    { number: 21, name: "Gavi", team: "España", rarity: "POCO_COMUN", price: 420, stock: 19 },
    { number: 22, name: "Federico Valverde", team: "Uruguay", rarity: "RARA", price: 680, stock: 12 },
    { number: 23, name: "Darwin Núñez", team: "Uruguay", rarity: "POCO_COMUN", price: 500, stock: 14 },
    { number: 24, name: "Neymar Jr.", team: "Brasil", rarity: "EPICA", price: 1000, stock: 5, },
    { number: 25, name: "Casemiro", team: "Brasil", rarity: "COMUN", price: 280, stock: 28 },
  ];

  for (const f of figuritas) {
    await prisma.figurita.upsert({
      where: { number: f.number },
      update: { stock: f.stock, price: f.price },
      create: f,
    });
  }
  console.log(`✓ ${figuritas.length} figuritas`);

  console.log("\nListo. Podés iniciar sesión con:");
  console.log("  Admin: admin@figus.ar / admin1234");
  console.log("  Usuario: juan@test.ar / user1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
