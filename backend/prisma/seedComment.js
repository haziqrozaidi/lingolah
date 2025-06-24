const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// You may want to adjust this to match your real users and posts.
const nonAdminUsers = [
  "cmcaulkpn0001uj1461x1kp9w", // learner
  "cmcawhqga0005mihgpwm283x7", // syahmisyaz
  "cmcawa8ro0003mihg75r6i96p", // syahmi
];

const commentSamples = [
  "Great post! Thanks for sharing.",
  "I totally agree with your points.",
  "Could you explain more about this?",
  "This was very helpful!",
  "Awesome, I didn't know that before.",
  "Thanks for the resources!",
  "Interesting, I'll try this out.",
  "Can you give an example?",
  "I've had similar experiences.",
  "Looking forward to more posts like this.",
  "This community is awesome!"
];

async function main() {
  // Get all posts in the database (you can filter for your seed posts, e.g. id startsWith "seed_post_")
  const posts = await prisma.post.findMany({
    select: { id: true }
  });

  let comments = [];
  let commentCount = 0;
  const now = new Date();

  for (const post of posts) {
    let numberOfComments = getRandomInt(1, 4);
    for (let j = 0; j < numberOfComments; ++j) {
      let userId = pick(nonAdminUsers);
      let content = pick(commentSamples) + (Math.random() < 0.25 ? " (edited)" : "");
      comments.push({
        id: `seed_comment_${commentCount}`,
        postId: post.id,
        userId: userId,
        content: content,
        createdAt: new Date(now.getTime() - getRandomInt(0, 90) * 3600 * 1000)
      });
      commentCount++;
    }
  }

  await prisma.comment.createMany({ data: comments, skipDuplicates: true });

  console.log("Seeded comments for all posts!");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });