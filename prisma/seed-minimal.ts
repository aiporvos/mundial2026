import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import path from "path";

const dbUrl = process.env.DATABASE_URL ?? `file:${path.resolve(process.cwd(), "dev.db")}`;
const adapter = new PrismaLibSql({ url: dbUrl.startsWith("file:") ? dbUrl : `file:${dbUrl}` });
const prisma = new PrismaClient({ adapter });

const figuritas = [
  // ARGENTINA
  { number: 20, name: "Escudo Argentina", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-1.webp" },
  { number: 21, name: "Emiliano Martinez", team: "Argentina", rarity: 'EPICA', price: 1200, stock: 7, imageUrl: "/figuritas/ARG-2.webp" },
  { number: 22, name: "Nahuel Molina", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-3.webp" },
  { number: 23, name: "Cristian Romero", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-4.webp" },
  { number: 24, name: "Nicolas Otamendi", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-5.webp" },
  { number: 25, name: "Nicolas Tagliafico", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-6.webp" },
  { number: 26, name: "Leonardo Balerdi", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-7.webp" },
  { number: 27, name: "Enzo Fernandez", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-8.webp" },
  { number: 28, name: "Alexis Mac Allister", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-9.webp" },
  { number: 29, name: "Rodrigo De Paul", team: "Argentina", rarity: 'POCO_COMUN', price: 500, stock: 20, imageUrl: "/figuritas/ARG-10.webp" },
  { number: 30, name: "Exequiel Palacios", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-11.webp" },
  { number: 31, name: "Leandro Paredes", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-12.webp" },
  { number: 32, name: "Plantel Argentina", team: "Argentina", rarity: 'COMUN', price: 220, stock: 30, imageUrl: "/figuritas/ARG-13.webp" },
  { number: 33, name: "Nico Paz", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-14.webp" },
  { number: 34, name: "Franco Mastantuono", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-15.webp" },
  { number: 35, name: "Nico Gonzalez", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-16.webp" },
  { number: 36, name: "Lionel Messi", team: "Argentina", rarity: 'LEGENDARIA', price: 2500, stock: 3, imageUrl: "/figuritas/ARG-17.webp" },
  { number: 37, name: "Lautaro Martinez", team: "Argentina", rarity: 'EPICA', price: 1000, stock: 7, imageUrl: "/figuritas/ARG-18.webp" },
  { number: 38, name: "Julian Alvarez", team: "Argentina", rarity: 'EPICA', price: 1100, stock: 7, imageUrl: "/figuritas/ARG-19.webp" },
  { number: 39, name: "Giuliano Simeone", team: "Argentina", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/ARG-20.webp" },
  // BRASIL
  { number: 120, name: "Escudo Brasil", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-1.webp" },
  { number: 121, name: "Alisson", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-2.webp" },
  { number: 122, name: "Bento", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-3.webp" },
  { number: 123, name: "Marquinhos", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-4.webp" },
  { number: 124, name: "Éder Militão", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-5.webp" },
  { number: 125, name: "Gabriel Magalhães", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-6.webp" },
  { number: 126, name: "Danilo", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-7.webp" },
  { number: 127, name: "Wesley", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-8.webp" },
  { number: 128, name: "Lucas Paquetá", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-9.webp" },
  { number: 129, name: "Casemiro", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-10.webp" },
  { number: 130, name: "Bruno Guimarães", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-11.webp" },
  { number: 131, name: "Luiz Henrique", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-12.webp" },
  { number: 132, name: "Plantel Brasil", team: "Brasil", rarity: 'COMUN', price: 220, stock: 30, imageUrl: "/figuritas/BRA-13.webp" },
  { number: 133, name: "Vinicius Júnior", team: "Brasil", rarity: 'EPICA', price: 900, stock: 7, imageUrl: "/figuritas/BRA-14.webp" },
  { number: 134, name: "Rodrygo", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-15.webp" },
  { number: 135, name: "João Pedro", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-16.webp" },
  { number: 136, name: "Matheus Cunha", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-17.webp" },
  { number: 137, name: "Gabriel Martinelli", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-18.webp" },
  { number: 138, name: "Raphinha", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-19.webp" },
  { number: 139, name: "Estêvão", team: "Brasil", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/BRA-20.webp" },
  // FRANCIA
  { number: 380, name: "Escudo Francia", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-1.webp" },
  { number: 381, name: "Mike Maignan", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-2.webp" },
  { number: 382, name: "Theo Hernandez", team: "Francia", rarity: 'POCO_COMUN', price: 460, stock: 20, imageUrl: "/figuritas/FRA-3.webp" },
  { number: 383, name: "William Saliba", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-4.webp" },
  { number: 384, name: "Jules Kounde", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-5.webp" },
  { number: 385, name: "Ibrahima Konate", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-6.webp" },
  { number: 386, name: "Dayot Upamecano", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-7.webp" },
  { number: 387, name: "Lucas Digne", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-8.webp" },
  { number: 388, name: "Aurélien Tchouaméni", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-9.webp" },
  { number: 389, name: "Eduardo Camavinga", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-10.webp" },
  { number: 390, name: "Manu Kone", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-11.webp" },
  { number: 391, name: "Adrien Rabiot", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-12.webp" },
  { number: 392, name: "Plantel Francia", team: "Francia", rarity: 'COMUN', price: 220, stock: 30, imageUrl: "/figuritas/FRA-13.webp" },
  { number: 393, name: "Michael Olise", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-14.webp" },
  { number: 394, name: "Ousmane Dembele", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-15.webp" },
  { number: 395, name: "Bradley Barcola", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-16.webp" },
  { number: 396, name: "Désiré Doué", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-17.webp" },
  { number: 397, name: "Kingsley Coman", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-18.webp" },
  { number: 398, name: "Hugo Ekitike", team: "Francia", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/FRA-19.webp" },
  { number: 399, name: "Kylian Mbappe", team: "Francia", rarity: 'LEGENDARIA', price: 2200, stock: 3, imageUrl: "/figuritas/FRA-20.webp" },
  // URUGUAY
  { number: 900, name: "Escudo Uruguay", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-1.webp" },
  { number: 901, name: "Sergio Rochet", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-2.webp" },
  { number: 902, name: "Santiago Mele", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-3.webp" },
  { number: 903, name: "Ronald Araujo", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-4.webp" },
  { number: 904, name: "José María Giménez", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-5.webp" },
  { number: 905, name: "Sebastian Caceres", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-6.webp" },
  { number: 906, name: "Mathias Olivera", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-7.webp" },
  { number: 907, name: "Guillermo Varela", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-8.webp" },
  { number: 908, name: "Nahitan Nandez", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-9.webp" },
  { number: 909, name: "Federico Valverde", team: "Uruguay", rarity: 'RARA', price: 680, stock: 12, imageUrl: "/figuritas/URU-10.webp" },
  { number: 910, name: "Giorgian De Arrascaeta", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: undefined },
  { number: 911, name: "Rodrigo Bentancur", team: "Uruguay", rarity: 'RARA', price: 750, stock: 12, imageUrl: "/figuritas/URU-12.webp" },
  { number: 912, name: "Plantel Uruguay", team: "Uruguay", rarity: 'COMUN', price: 220, stock: 30, imageUrl: undefined },
  { number: 913, name: "Manuel Ugarte", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-14.webp" },
  { number: 914, name: "Nicolás de la Cruz", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: undefined },
  { number: 915, name: "Maxi Araujo", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-16.webp" },
  { number: 916, name: "Darwin Núñez", team: "Uruguay", rarity: 'POCO_COMUN', price: 500, stock: 20, imageUrl: "/figuritas/URU-17.webp" },
  { number: 917, name: "Federico Viñas", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-18.webp" },
  { number: 918, name: "Rodrigo Aguirre", team: "Uruguay", rarity: 'RARA', price: 750, stock: 12, imageUrl: undefined },
  { number: 919, name: "Facundo Pellistri", team: "Uruguay", rarity: 'COMUN', price: 200, stock: 30, imageUrl: "/figuritas/URU-20.webp" },
] as const;

async function main() {
  console.log("Seeding...");

  const hashed = await bcrypt.hash("admin1234", 12);
  await prisma.user.upsert({
    where: { email: "admin@figus.ar" },
    update: {},
    create: { email: "admin@figus.ar", password: hashed, name: "Admin", lastName: "Figus", emailVerified: true, role: "ADMIN" },
  });

  const hashedUser = await bcrypt.hash("user1234", 12);
  await prisma.user.upsert({
    where: { email: "usuario@figus.ar" },
    update: {},
    create: { email: "usuario@figus.ar", password: hashedUser, name: "Usuario", lastName: "Prueba", emailVerified: true, role: "USER" },
  });

  console.log("✓ Admin: admin@figus.ar / admin1234");
  console.log("✓ User:  usuario@figus.ar / user1234");

  for (const fig of figuritas) {
    await prisma.figurita.upsert({
      where: { number: fig.number },
      update: {},
      create: { ...fig, imageUrl: fig.imageUrl ?? null },
    });
  }

  console.log(`✓ ${figuritas.length} figuritas seeded (ARG, BRA, FRA, URU)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
