const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

async function main() {
  const adminId = 'cmcauko2g0000uj143dqz620o';
  const communityIds = [
    'cmcavodh9000zmi1kkootr33i',
    'cmcaygjro0000miq4negffnox',
    'cmcayhvk00001miq4cr09wnn0',
    'cmcaz2pnc0002miq4s4zuxe31',
    'cmcb0x2el000zmih01rxdvi56'
  ];

  for (const communityId of communityIds) {
    try {
      await prisma.communityMember.upsert({
        where: {
          userId_communityId: {
            userId: adminId,
            communityId: communityId,
          }
        },
        update: { status: 'accepted' },
        create: {
          userId: adminId,
          communityId: communityId,
          status: 'accepted'
        }
      });
      console.log(`Ensured admin is a member of community ${communityId}`);
    } catch (e) {
      console.error(`Error for community ${communityId}:`, e.message);
    }
  }
  await prisma.$disconnect();
}

main();