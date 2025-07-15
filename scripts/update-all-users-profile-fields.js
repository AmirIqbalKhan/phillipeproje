// scripts/update-all-users-profile-fields.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const defaultAvatar = '/logo.png';
  const defaultBio = 'Welcome to my profile!';

  // Find users missing avatar or bio
  const usersToUpdate = await prisma.user.findMany({
    where: {
      OR: [
        { avatar: null },
        { avatar: '' },
        { bio: null },
        { bio: '' },
      ],
    },
    select: { id: true, name: true, email: true, avatar: true, bio: true },
    take: 3,
  });
  const countBefore = await prisma.user.count({
    where: {
      OR: [
        { avatar: null },
        { avatar: '' },
        { bio: null },
        { bio: '' },
      ],
    },
  });

  console.log(`Users missing avatar or bio before update: ${countBefore}`);
  if (usersToUpdate.length > 0) {
    console.log('Sample users to update:', usersToUpdate);
  }

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

  const countAfter = await prisma.user.count({
    where: {
      OR: [
        { avatar: null },
        { avatar: '' },
        { bio: null },
        { bio: '' },
      ],
    },
  });

  console.log(`Updated ${updated.count} users with default avatar and bio.`);
  console.log(`Users missing avatar or bio after update: ${countAfter}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 