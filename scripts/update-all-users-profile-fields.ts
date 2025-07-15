// scripts/update-all-users-profile-fields.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const defaultAvatar = '/logo.png';
  const defaultBio = 'Welcome to my profile!';

  const updated = await prisma.user.updateMany({
    where: {
      OR: [
        { avatar: null },
        { avatar: '' },
        { bio: null },
        { bio: '' },
      ],
    },
    data: {
      avatar: defaultAvatar,
      bio: defaultBio,
    },
  });

  console.log(`Updated ${updated.count} users with default avatar and bio.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 