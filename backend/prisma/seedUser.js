const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 'cmcauko2g0000uj143dqz620o' },
    update: {},
    create: {
      id: 'cmcauko2g0000uj143dqz620o',
      clerkUserId: 'user_2yxv1rKHNjeYc5n4qmGfk9qeOwr',
      username: 'admin',
      email: 'admin@gmail.com',
      role: 'admin',
      createdAt: new Date('2025-06-24T18:16:52.695Z')
    }
  });

  await prisma.user.upsert({
    where: { id: 'cmcaulkpn0001uj1461x1kp9w' },
    update: {},
    create: {
      id: 'cmcaulkpn0001uj1461x1kp9w',
      clerkUserId: 'user_2yxvS7hV6LtMAJcqSNBnCG9E8bR',
      username: 'learner',
      email: 'learner@gmail.com',
      role: 'member',
      createdAt: new Date('2025-06-24T18:17:35.004Z')
    }
  });

  await prisma.user.upsert({
    where: { id: 'cmcawhqga0005mihgpwm283x7' },
    update: {},
    create: {
      id: 'cmcawhqga0005mihgpwm283x7',
      clerkUserId: 'user_2yuvSbbsDOh92bjrIDNSoQoYR19',
      username: 'syahmisyaz',
      email: 'ms.syazwan@graduate.utm.my',
      role: 'member',
      createdAt: new Date('2025-06-24T19:10:35.051Z')
    }
  });

  await prisma.user.upsert({
    where: { id: 'cmcawhbqu0004mihgv2wf2o2o' },
    update: {},
    create: {
      id: 'cmcawhbqu0004mihgv2wf2o2o',
      clerkUserId: 'user_2ysCvMJe69wWPulvJId2hl23EID',
      username: 'syahmitest',
      email: 'camirubix@gmail.com',
      role: 'admin',
      createdAt: new Date('2025-06-24T19:10:15.99Z')
    }
  });

  await prisma.user.upsert({
    where: { id: 'cmcawa8ro0003mihg75r6i96p' },
    update: {},
    create: {
      id: 'cmcawa8ro0003mihg75r6i96p',
      clerkUserId: 'user_2yp4tJzL7lvtH56li3vCO1FxfLk',
      username: 'syahmi',
      email: 'syahmimuhd30@gmail.com',
      role: 'member',
      createdAt: new Date('2025-06-24T19:04:45.541Z')
    }
  });

  console.log("Seeded all users!");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });