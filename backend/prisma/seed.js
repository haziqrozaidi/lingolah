const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.video.createMany({
    data: [
      {
        title: "Nasi lemak",
        url: "https://www.youtube.com/watch?v=RLUGJFuvvDc",
        description: "Learn how to cook Nasi lemak, a popular Malaysian dish.",
        topic: "Food",
        subtitles: "",
      },
      {
        title: "Tioman Island",
        url: "https://www.youtube.com/watch?v=4tXmFMo03QA",
        description:
          "Explore the beauty of Tioman Island, a tropical paradise in Malaysia.",
        topic: "Travel",
        subtitles: "",
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeding done");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
