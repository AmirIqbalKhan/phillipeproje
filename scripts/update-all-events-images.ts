import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getUnsplashImage(query: string): Promise<string> {
  try {
    const res = await fetch(`https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`);
    return res.url;
  } catch (e) {
    // fallback image
    return 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80';
  }
}

async function main() {
  const events = await prisma.event.findMany();
  let updatedCount = 0;
  for (const event of events) {
    if (!event.images || event.images.length === 0) {
      const query = event.category || event.name || 'event';
      const imageUrl = await getUnsplashImage(query);
      await prisma.event.update({
        where: { id: event.id },
        data: { images: [imageUrl] },
      });
      updatedCount++;
      console.log(`Updated event ${event.id} with Unsplash image: ${imageUrl}`);
    }
  }
  console.log(`Updated ${updatedCount} events with Unsplash images.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 