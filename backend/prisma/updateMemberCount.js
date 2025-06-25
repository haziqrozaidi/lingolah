const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

async function main() {
  const communityIds = [
    'cmcavodh9000zmi1kkootr33i',
    'cmcaygjro0000miq4negffnox',
    'cmcayhvk00001miq4cr09wnn0',
    'cmcaz2pnc0002miq4s4zuxe31',
    'cmcb0x2el000zmih01rxdvi56'
  ];

  for (const communityId of communityIds) {
    try {
      // Count the number of members for this community
      const count = await prisma.communityMember.count({
        where: { communityId },
      });
      // Update member_count in the Community table
      await prisma.community.update({
        where: { id: communityId },
        data: { memberCount: count },
      });
      console.log(`Updated memberCount for ${communityId} to ${count}`);
    } catch (e) {
      console.error(`Error for community ${communityId}:`, e.message);
    }
  }
  await prisma.$disconnect();
}

main();