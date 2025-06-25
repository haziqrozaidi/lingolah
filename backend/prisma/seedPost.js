const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const communityData = [
  {
    id: "cmcavodh9000zmi1kkootr33i",
    name: "Malay Language Masters",
    description: "A hub for passionate learners and teachers of the Malay language. Share advanced tips, resources, and encourage one another to master Malay together.",
    establishedDate: new Date("2025-01-01T00:00:00.000Z"),
    memberCount: 2,
  },
  {
    id: "cmcaygjro0000miq4negffnox",
    name: "Everyday Malay Conversations",
    description: "Practice daily conversations, exchange casual phrases, and help each other become fluent in real-life Malay speaking scenarios.",
    establishedDate: new Date("2025-06-05T00:00:00.000Z"),
    memberCount: 2,
  },
  {
    id: "cmcayhvk00001miq4cr09wnn0",
    name: "Grammar Gurus of Malay",
    description: "Deep-dive into Malay grammar, ask questions, and get help with tricky sentence structures or rules.",
    establishedDate: new Date("2025-06-04T00:00:00.000Z"),
    memberCount: 2,
  },
  {
    id: "cmcaz2pnc0002miq4s4zuxe31",
    name: "Malay Culture & Expressions",
    description: "Discuss unique Malay idioms, proverbs, and cultural expressions. Learn the language through the lens of culture.",
    establishedDate: new Date("2025-06-04T00:00:00.000Z"),
    memberCount: 2,
  },
];

const allUsers = [
  { id: "cmcaulkpn0001uj1461x1kp9w", username: "learner", role: "member" },
  { id: "cmcauko2g0000uj143dqz620o", username: "admin", role: "admin" },
  { id: "cmcawhqga0005mihgpwm283x7", username: "syahmisyaz", role: "member" },
  { id: "cmcawhbqu0004mihgv2wf2o2o", username: "syahmitest", role: "admin" },
  { id: "cmcawa8ro0003mihg75r6i96p", username: "syahmi", role: "member" },
];

const nonAdminUsers = allUsers.filter(u => u.role !== "admin").map(u => u.id);
const adminIds = allUsers.filter(u => u.role === "admin").map(u => u.id);

const categories = [
  "General Discussion",
  "Help & Support",
  "Feature Requests",
  "Bug Reports",
  "Announcements & Updates",
  "Language Learning Resources",
  "Tutorials & Guides",
  "Feedback & Suggestions",
  "Contributing & Development",
  "Localization & Translations",
  "Off-topic"
];

const postDetails = [
  {
    title: "General Malay Chat: What got you started?",
    content: "Welcome to our general discussion! Share your journey, why you chose to learn Malay, and what keeps you motivated. Everyone's story is unique—let's get inspired by each other! Are you learning for travel, family, or just for fun?",
  },
  {
    title: "Need Help? Ask Your Questions Here!",
    content: "This is the go-to thread for any questions or problems you encounter while learning Malay. No question is too basic or too advanced. Our community is here to support you, so post your queries and get answers fast!",
  },
  {
    title: "Suggest a Feature for Our Platform",
    content: "We want to make this platform better for everyone. If you have an idea for a new feature or improvement, describe it here in detail! Include your use-case, why it would help, and any similar tools you've seen elsewhere.",
  },
  {
    title: "Found a Bug? Report It Here!",
    content: "If you notice anything not working as expected—errors, glitches, or strange behavior—please report it. Include steps to reproduce, browser/device info, and screenshots if possible. We appreciate your help in making this site better!",
  },
  {
    title: "Announcements & Updates",
    content: "Stay tuned for the latest news, updates, and important information about the Malay Language community and our platform. We'll post release notes, new features, and community milestones here.",
  },
  {
    title: "Best Language Learning Resources",
    content: "Share your favorite resources: websites, books, YouTube channels, podcasts, and apps that have helped you learn Malay. Write a short review or explain why you recommend them. Let's build the ultimate resource list!",
  },
  {
    title: "Step-by-step Tutorials & Guides",
    content: "Post or request detailed tutorials—grammar explanations, pronunciation guides, study routines, or anything else that helps learners progress. If you've written a guide, share it here. If you want a tutorial, ask for it!",
  },
  {
    title: "We Value Your Feedback & Suggestions",
    content: "Your opinion matters! If you notice something we could do better, or if you love a particular feature, let us know here. Please be constructive—your thoughts help us grow.",
  },
  {
    title: "How to Contribute & Join Development",
    content: "Interested in contributing code, content, or moderation? Introduce yourself and let us know your skills and interests. We'll guide you to the right place to get started as a contributor.",
  },
  {
    title: "Localization & Translations",
    content: "Help us localize the platform and resources. If you can translate content, proofread, or spot errors in Malay or other languages, post here! Let's make knowledge accessible for everyone.",
  },
  {
    title: "The Off-topic Lounge",
    content: "Anything goes! Chat about your hobbies, share memes, or discuss topics unrelated to Malay. Please keep it respectful and fun.",
  }
];

// Sample comments for posts
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
  // Seed Communities (created by first admin)
  await prisma.community.createMany({
    data: communityData.map(c => ({
      id: c.id,
      name: c.name,
      establishedDate: c.establishedDate,
      establishedBy: adminIds[0],
      memberCount: c.memberCount,
    })),
    skipDuplicates: true,
  });

  // Seed Community Members: Make sure each non-admin is a member of each community (status: accepted)
  for (const c of communityData) {
    for (const userId of nonAdminUsers) {
      await prisma.communityMember.upsert({
        where: { userId_communityId: { userId: userId, communityId: c.id } },
        update: { status: "accepted" },
        create: { userId: userId, communityId: c.id, status: "accepted" }
      });
    }
  }

  // Seed Posts: 44 in communities (by non-admins), 16 global (by non-admins), one for each category at least
  var posts = [];
  var now = new Date();
  var communityIds = communityData.map(c => c.id);

  let postIdList = [];

  for (let i = 0; i < 44; ++i) {
    let communityId = pick(communityIds);
    let userId = pick(nonAdminUsers);
    let catIdx = i % categories.length;
    let details = postDetails[catIdx];
    let category = categories[catIdx];
    let viewCount = getRandomInt(20, 400);
    let date = new Date(now.getTime() - getRandomInt(0, 90) * 3600 * 1000);

    let post_id = "seed_post_" + i;
    postIdList.push(post_id);

    posts.push({
      id: post_id,
      title: details.title,
      content: details.content + "\n\nLet's discuss in the comments: What would you add to this topic? Any personal experiences, corrections, or resources to share?",
      category: category,
      viewCount: viewCount,
      date: date,
      userId: userId,
      reported: false,
      reportResolved: false,
      moderationNote: null,
      communityId: communityId,
    });
  }
  // 16 global posts
  for (let i = 44; i < 60; ++i) {
    let userId = pick(nonAdminUsers);
    let catIdx = i % categories.length;
    let details = postDetails[catIdx];
    let category = categories[catIdx];
    let viewCount = getRandomInt(20, 400);
    let date = new Date(now.getTime() - getRandomInt(0, 90) * 3600 * 1000);

    let post_id = "seed_post_" + i;
    postIdList.push(post_id);

    posts.push({
      id: post_id,
      title: details.title,
      content: details.content + "\n\nShare your thoughts or questions below. The whole community is here to help!",
      category: category,
      viewCount: viewCount,
      date: date,
      userId: userId,
      reported: false,
      reportResolved: false,
      moderationNote: null,
      communityId: null,
    });
  }
  await prisma.post.createMany({ data: posts, skipDuplicates: true });

  // Seed Comments: 1-4 comments per post, users randomly picked
  let comments = [];
  let commentCount = 0;
  for (const post_id of postIdList) {
    let numberOfComments = getRandomInt(1, 4);
    for (let j = 0; j < numberOfComments; ++j) {
      let userId = pick(nonAdminUsers);
      let content = pick(commentSamples) + (Math.random() < 0.25 ? " (edited)" : "");
      comments.push({
        id: `seed_comment_${commentCount}`,
        post_id: post_id,
        user_id: userId,
        content: content,
        created_at: new Date(now.getTime() - getRandomInt(0, 90) * 3600 * 1000)
      });
      commentCount++;
    }
  }
  await prisma.comment.createMany({ data: comments, skipDuplicates: true });

  // Seed Likes: 1-3 likes per post, by different non-admins
  let likes = [];
  for (const post_id of postIdList) {
    let shuffled = nonAdminUsers.slice().sort(() => Math.random() - 0.5);
    let numberOfLikes = getRandomInt(1, 3);
    for (let i = 0; i < numberOfLikes; ++i) {
      likes.push({
        post_id: post_id,
        user_id: shuffled[i]
      });
    }
  }
  await prisma.like.createMany({ data: likes, skipDuplicates: true });

  console.log("Seeded communities, members, posts, comments, and likes with detailed categories!");
}

main()
  .then(async function() {
    await prisma.$disconnect();
  })
  .catch(async function(e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });