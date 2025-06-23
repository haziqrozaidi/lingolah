var express = require("express");
var router = express.Router();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// Middleware to check if user is admin using Clerk ID
async function requireAdmin(req, res, next) {
  const userId = req.body.userId || req.body.establishedBy;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  // Find user by Clerk user ID
  const user = await prisma.user.findFirst({ where: { clerkUserId: userId } });
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  // Attach user to request for later use
  req.dbUser = user;
  next();
}

router.post("/create", requireAdmin, async (req, res) => {
  try {
    const { name, establishedDate } = req.body;
    const user = req.dbUser; // Set by middleware

    if (!name || !establishedDate) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Create the community and add creator as first member
    const community = await prisma.community.create({
      data: {
        name,
        establishedBy: user.id, // use internal PK for establishedBy
        establishedDate: new Date(establishedDate),
        memberCount: 1,
        members: {
          create: { userId: user.id },
        },
      },
      include: {
        members: true,
      },
    });

    res.status(201).json({ community });
  } catch (err) {
    console.error(err);
    // Handle foreign key errors gracefully
    if (err.code === "P2003") {
      return res
        .status(400)
        .json({ error: "Invalid user: user not found in database" });
    }
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

router.get("/available", async (req, res) => {
  const { clerkUserId } = req.query;
  if (!clerkUserId)
    return res.status(400).json({ error: "clerkUserId required" });

  // Find user in DB
  const user = await prisma.user.findFirst({ where: { clerkUserId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Find communities the user hasn't joined
  const joinedIds = (
    await prisma.communityMember.findMany({
      where: { userId: user.id },
      select: { communityId: true },
    })
  ).map((cm) => cm.communityId);

  const available = await prisma.community.findMany({
    where: { id: { notIn: joinedIds } },
  });

  res.json({ communities: available });
});

// --- Add join community endpoint ---
const { findUserByClerkId } = require("../utils/userHelpers");

router.post("/join", async (req, res) => {
  try {
    const { communityId, clerkUserId } = req.body;
    if (!communityId || !clerkUserId) {
      return res
        .status(400)
        .json({ error: "communityId and clerkUserId are required" });
    }

    // Find user in DB by Clerk user ID
    var user = await prisma.user.findFirst({ where: { clerkUserId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already joined
    const existingMember = await prisma.communityMember.findFirst({
      where: { userId: user.id, communityId },
    });
    if (existingMember) {
      return res
        .status(400)
        .json({ error: "User already joined this community" });
    }
    user = await findUserByClerkId(clerkUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const dbUserId = user.id;
    console.log("DB User ID:", dbUserId);
    // Add user as community member (linked by DB user id, not clerk user id)
    const newMember = await prisma.communityMember.create({
      data: {
        communityId,
        userId: dbUserId,
      },
    });

    // Optional: increment community memberCount
    await prisma.community.update({
      where: { id: communityId },
      data: { memberCount: { increment: 1 } },
    });

    res
      .status(201)
      .json({ message: "Joined community successfully", member: newMember });
  } catch (err) {
    console.error(err);
    if (err.code === "P2003") {
      return res.status(400).json({ error: "Invalid community or user" });
    }
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

// GET /api/communities/joined?clerkUserId=xxx
router.get("/joined", async (req, res) => {
  const { clerkUserId } = req.query;

  const user = await prisma.user.findFirst({ where: { clerkUserId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  const dbUserId = user.id;
  const joinedCommunities = await prisma.communityMember.findMany({
    where: { userId: dbUserId },
    include: { community: true },
  });

  res.json({ communities: joinedCommunities.map((cm) => cm.community) });
});

module.exports = router;
