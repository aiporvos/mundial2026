#!/usr/bin/env python3
"""Generate prisma/seed-full.ts from figusdelmundial_images.json"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
DATA_FILE = ROOT / "figusdelmundial_images.json"
IMG_DIR = ROOT / "public" / "figuritas"
OUT_FILE = ROOT / "prisma" / "seed-full.ts"

TEAM_NAMES = {
    "ALG": "Argelia",
    "ARG": "Argentina",
    "AUS": "Australia",
    "AUT": "Austria",
    "BEL": "Bélgica",
    "BIH": "Bosnia-Herzegovina",
    "BRA": "Brasil",
    "CAN": "Canadá",
    "CC": "Copa Coca-Cola",
    "CIV": "Costa de Marfil",
    "COD": "Rep. Dem. del Congo",
    "COL": "Colombia",
    "CPV": "Cabo Verde",
    "CRO": "Croacia",
    "CUW": "Curaçao",
    "CZE": "República Checa",
    "ECU": "Ecuador",
    "EGY": "Egipto",
    "ENG": "Inglaterra",
    "ESP": "España",
    "EXTRA": "Especiales",
    "FRA": "Francia",
    "FWC": "FIFA World Cup",
    "GER": "Alemania",
    "GHA": "Ghana",
    "HAI": "Haití",
    "IRN": "Irán",
    "IRQ": "Irak",
    "JOR": "Jordania",
    "JPN": "Japón",
    "KOR": "Corea del Sur",
    "KSA": "Arabia Saudita",
    "MAR": "Marruecos",
    "MEX": "México",
    "NED": "Países Bajos",
    "NOR": "Noruega",
    "NZL": "Nueva Zelanda",
    "PAN": "Panamá",
    "PAR": "Paraguay",
    "POR": "Portugal",
    "QAT": "Catar",
    "RSA": "Sudáfrica",
    "SCO": "Escocia",
    "SEN": "Senegal",
    "SUI": "Suiza",
    "SWE": "Suecia",
    "TUN": "Túnez",
    "TUR": "Turquía",
    "URU": "Uruguay",
    "USA": "Estados Unidos",
    "UZB": "Uzbekistán",
}

# Player name → (rarity, price)
STAR_PLAYERS = {
    "lionel messi": ("LEGENDARIA", 2500),
    "kylian mbappé": ("LEGENDARIA", 2200),
    "kylian mbappe": ("LEGENDARIA", 2200),
    "erling haaland": ("LEGENDARIA", 2000),
    "vinicius jr": ("EPICA", 1400),
    "vinicius jr.": ("EPICA", 1400),
    "jude bellingham": ("EPICA", 1300),
    "lamine yamal": ("EPICA", 1200),
    "julián álvarez": ("EPICA", 1100),
    "julian alvarez": ("EPICA", 1100),
    "emiliano martínez": ("EPICA", 1200),
    "emiliano martinez": ("EPICA", 1200),
    "pedri": ("RARA", 800),
    "rodri": ("RARA", 750),
    "ángel di maría": ("RARA", 850),
    "angel di maria": ("RARA", 850),
    "rodrigo de paul": ("POCO_COMUN", 500),
    "lautaro martínez": ("EPICA", 1000),
    "lautaro martinez": ("EPICA", 1000),
    "bukayo saka": ("POCO_COMUN", 480),
    "phil foden": ("POCO_COMUN", 460),
    "gavi": ("POCO_COMUN", 420),
    "federico valverde": ("RARA", 680),
    "darwin núñez": ("POCO_COMUN", 500),
    "darwin nunez": ("POCO_COMUN", 500),
    "neymar jr": ("EPICA", 1000),
    "neymar jr.": ("EPICA", 1000),
    "cristiano ronaldo": ("LEGENDARIA", 2400),
    "ronaldo": ("LEGENDARIA", 2400),
    "riyad mahrez": ("RARA", 700),
    "heung-min son": ("RARA", 750),
    "son heung-min": ("RARA", 750),
    "trent alexander-arnold": ("RARA", 700),
    "declan rice": ("POCO_COMUN", 480),
    "harry kane": ("EPICA", 1100),
    "theo hernández": ("POCO_COMUN", 460),
    "theo hernandez": ("POCO_COMUN", 460),
    "kylian mbappe": ("LEGENDARIA", 2200),
    "marcus rashford": ("POCO_COMUN", 450),
    "ferran torres": ("POCO_COMUN", 430),
    "marcos llorente": ("COMUN", 250),
    "marco verratti": ("RARA", 680),
    "kim min-jae": ("POCO_COMUN", 460),
    "takefusa kubo": ("POCO_COMUN", 450),
    "hiroki ito": ("COMUN", 250),
    "ivan perisic": ("POCO_COMUN", 450),
    "luka modric": ("EPICA", 1050),
    "robert lewandowski": ("EPICA", 1100),
    "virgil van dijk": ("RARA", 720),
    "memphis depay": ("POCO_COMUN", 460),
    "alexis sanchez": ("POCO_COMUN", 430),
    "sébastien haller": ("POCO_COMUN", 420),
    "sadio mané": ("RARA", 720),
    "sadio mane": ("RARA", 720),
    "antoine griezmann": ("RARA", 780),
    "lionel messi (bronce)": ("LEGENDARIA", 3500),
}

RARITY_DEFAULTS = {
    "COMUN": 200,
    "POCO_COMUN": 400,
    "RARA": 700,
    "EPICA": 1200,
    "LEGENDARIA": 2500,
}

RARITY_STOCK = {
    "COMUN": 30,
    "POCO_COMUN": 20,
    "RARA": 12,
    "EPICA": 7,
    "LEGENDARIA": 3,
}


def get_team_code(code: str) -> str:
    if "::" in code or code.startswith("EXTRA"):
        return "EXTRA"
    if code.startswith("CC"):
        return "CC"
    if "-" in code:
        return code.split("-")[0]
    return "OTHER"


def get_rarity_and_price(code: str, alt: str):
    alt_lower = alt.lower().strip()

    # EXTRA stickers (like Messi bronce)
    if "::" in code or code.startswith("EXTRA"):
        star = STAR_PLAYERS.get(alt_lower)
        if star:
            return star
        return ("LEGENDARIA", 2500)

    # FWC stickers
    if code.startswith("FWC"):
        num_match = re.search(r"\d+", code)
        n = int(num_match.group()) if num_match else 99
        if n <= 4:
            return ("EPICA", 1100)
        return ("RARA", 750)

    # CC (Copa Coca-Cola) stickers
    if code.startswith("CC"):
        return ("POCO_COMUN", 450)

    # Team stickers
    parts = code.split("-")
    if len(parts) == 2:
        sticker_num_match = re.search(r"\d+", parts[1])
        sticker_num = int(sticker_num_match.group()) if sticker_num_match else 0

        # Badge sticker (usually #1)
        if sticker_num == 1 and ("escudo" in alt_lower or "badge" in alt_lower or "logo" in alt_lower):
            return ("COMUN", 200)
        # Team photo sticker (usually #13)
        if "plantel" in alt_lower or "squad" in alt_lower or "team" in alt_lower:
            return ("COMUN", 220)

    # Check star players
    star = STAR_PLAYERS.get(alt_lower)
    if star:
        return star

    # Partial match for star players
    for player_name, value in STAR_PLAYERS.items():
        if player_name in alt_lower:
            return value

    # Default COMUN for regular players
    return ("COMUN", 200)


def safe_filename(code: str) -> str:
    return code.replace("::", "_").replace("/", "-").replace(" ", "_") + ".webp"


def main():
    data = json.loads(DATA_FILE.read_text())

    figuritas = []
    num = 1

    for item in data:
        code = item["code"]
        alt = item["alt"] or code
        src = item["src"]

        team_code = get_team_code(code)
        team_name = TEAM_NAMES.get(team_code, team_code)

        rarity, price = get_rarity_and_price(code, alt)
        stock = RARITY_STOCK[rarity]

        filename = safe_filename(code)
        img_path = IMG_DIR / filename
        image_url = f"/figuritas/{filename}" if img_path.exists() else None

        figuritas.append({
            "number": num,
            "code": code,
            "name": alt,
            "team": team_name,
            "rarity": rarity,
            "price": price,
            "stock": stock,
            "imageUrl": image_url,
        })
        num += 1

    # Stats
    from collections import Counter
    rarity_counts = Counter(f["rarity"] for f in figuritas)
    missing_imgs = sum(1 for f in figuritas if not f["imageUrl"])
    print(f"Total figuritas: {len(figuritas)}")
    print(f"Rarity distribution: {dict(rarity_counts)}")
    print(f"Missing images: {missing_imgs}")

    # Generate TypeScript seed
    ts_entries = []
    for f in figuritas:
        img = f"'${f['imageUrl']}'" if f["imageUrl"] else "undefined"
        ts_entries.append(
            f"  {{ number: {f['number']}, name: {json.dumps(f['name'])}, team: {json.dumps(f['team'])}, "
            f"rarity: '{f['rarity']}', price: {f['price']}, stock: {f['stock']}, "
            f"imageUrl: {json.dumps(f['imageUrl']) if f['imageUrl'] else 'undefined'} }},"
        )

    ts_content = f'''import {{ PrismaLibSql }} from "@prisma/adapter-libsql";
import {{ PrismaClient }} from "@prisma/client";
import bcrypt from "bcryptjs";
import path from "path";

const dbUrl = `file:${{path.resolve(process.cwd(), "dev.db")}}`;
const adapter = new PrismaLibSql({{ url: dbUrl }});
const prisma = new PrismaClient({{ adapter }});

const figuritas = [
{chr(10).join(ts_entries)}
] as const;

async function main() {{
  console.log("Seeding...");

  const hashed = await bcrypt.hash("admin1234", 12);
  await prisma.user.upsert({{
    where: {{ email: "admin@figus.ar" }},
    update: {{}},
    create: {{
      email: "admin@figus.ar",
      password: hashed,
      name: "Admin",
      lastName: "Figus",
      emailVerified: true,
      role: "ADMIN",
    }},
  }});
  console.log("✓ Admin: admin@figus.ar / admin1234");

  const hashedUser = await bcrypt.hash("user1234", 12);
  await prisma.user.upsert({{
    where: {{ email: "juan@test.ar" }},
    update: {{}},
    create: {{
      email: "juan@test.ar",
      password: hashedUser,
      name: "Juan",
      lastName: "Pérez",
      emailVerified: true,
      role: "USER",
    }},
  }});
  console.log("✓ Usuario: juan@test.ar / user1234");

  for (const f of figuritas) {{
    await prisma.figurita.upsert({{
      where: {{ number: f.number }},
      update: {{ stock: f.stock, price: f.price, imageUrl: f.imageUrl ?? null }},
      create: {{ ...f, imageUrl: f.imageUrl ?? null }},
    }});
  }}
  console.log(`✓ ${{figuritas.length}} figuritas`);

  console.log("\\nListo.");
  console.log("  Admin: admin@figus.ar / admin1234");
  console.log("  Usuario: juan@test.ar / user1234");
}}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
'''

    OUT_FILE.write_text(ts_content)
    print(f"\nSeed generado en: {OUT_FILE}")


if __name__ == "__main__":
    main()
