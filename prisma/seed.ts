// seeds.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await createCountries();
}

async function createCountries() {
  const americaCountries = [
    { name: 'Argentina' },
    { name: 'Bolivia' },
    { name: 'Brazil' },
    { name: 'Canada' },
    { name: 'Chile' },
    { name: 'Colombia' },
    { name: 'Costa Rica' },
    { name: 'Cuba' },
    { name: 'Dominican Republic' },
    { name: 'Ecuador' },
    { name: 'El Salvador' },
    { name: 'Guatemala' },
    { name: 'Haiti' },
    { name: 'Honduras' },
    { name: 'Jamaica' },
    { name: 'Mexico' },
    { name: 'Nicaragua' },
    { name: 'Panama' },
    { name: 'Paraguay' },
    { name: 'Peru' },
    { name: 'Puerto Rico' },
    { name: 'United States' },
    { name: 'Uruguay' },
    { name: 'Venezuela' },
    // Agrega más países de América según sea necesario
  ];

  for (const country of americaCountries) {
    await prisma.country.create({
      data: {
        name: country.name,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
