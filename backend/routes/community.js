var express = require("express");
var router = express.Router();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { requireAuth } = require("@clerk/express");
const requireAdmin = require("../middleware/requireAdmin");
const { findUserByClerkId } = require("../utils/userHelpers");
const cors = require('cors');
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// --- ADMIN/MANAGER ROUTES ---

/**
 * List members (pending or accepted)
 */
router.get("/:communityId/members", requireAuth(), requireAdmin, async (req, res) => {
  const { communityId } = req.params;
  const { status } = req.query; // 'pending' or 'accepted'
  const members = await prisma.communityMember.findMany({
    where: {
      communityId,
      ...(status ? { status } : {}),
    },
    include: { user: true },
  });
  res.json({ members });
});

/**
 * Approve a pending member
 */
router.post(
  "/:communityId/members/:userId/approve",
  requireAuth(), requireAdmin,
  async (req, res) => {
    const { communityId, userId } = req.params;
    // Update status to accepted
    const member = await prisma.communityMember.update({
      where: { userId_communityId: { userId, communityId } },
      data: { status: "accepted" },
    });
    // FIX: Only increment memberCount on approval
    await prisma.community.update({
      where: { id: communityId },
      data: { memberCount: { increment: 1 } },
    });
    res.json({ member });
  }
);

/**
 * Reject a pending member (delete request)
 */
router.post(
  "/:communityId/members/:userId/reject",
  requireAuth(), requireAdmin,
  async (req, res) => {
    const { communityId, userId } = req.params;
    // Delete pending member, NO decrement of memberCount needed (was not incremented on request)
    await prisma.communityMember.delete({
      where: { userId_communityId: { userId, communityId } },
    });
    res.json({ success: true });
  }
);

/**
 * Kick a member (remove from community)
 */
router.delete(
  "/:communityId/members/:userId",
  requireAuth(), requireAdmin,
  async (req, res) => {
    const { communityId, userId } = req.params;
    // Delete from members table
    await prisma.communityMember.delete({
      where: { userId_communityId: { userId, communityId } },
    });
    // Decrement member count (only for accepted members)
    await prisma.community.update({
      where: { id: communityId },
      data: { memberCount: { decrement: 1 } }
    });
    res.json({ success: true });
  }
);

/**
 * Disband (delete) a community
 */
router.delete("/:communityId", requireAuth(), requireAdmin, async (req, res) => {
  const { communityId } = req.params;
  await prisma.communityMember.deleteMany({ where: { communityId } });
  await prisma.community.delete({ where: { id: communityId } });
  res.json({ success: true });
});

/**
 * List all communities managed by the current admin (legacy route)
 */
router.get("/admin", requireAuth(), requireAdmin, async (req, res) => {
  try {
    const user = req.dbUser || req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const adminId = user.id;
    const communities = await prisma.community.findMany({
      where: { establishedBy: adminId },
    });
    res.json({ communities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch admin communities" });
  }
});

/**
 * List all communities managed by the current admin (standard route)
 */
router.get("/managed", requireAuth(), requireAdmin, async (req, res) => {
  const user = req.dbUser || req.user;
  try {
    const communities = await prisma.community.findMany({
      where: { establishedBy: user.id },
    });
    res.json({ communities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch managed communities." });
  }
});

// --- COMMUNITY CREATION & MEMBERSHIP (for users & admins) ---

/**
 * Create a community (admin)
 */
router.post("/create", requireAuth(), requireAdmin, async (req, res) => {
  try {
    const { name, establishedDate } = req.body;
    const user = req.dbUser || req.user; // Set by middleware

    if (!name || !establishedDate) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Create the community and add creator as first member with status "accepted"
    const community = await prisma.community.create({
      data: {
        name,
        establishedBy: user.id,
        establishedDate: new Date(establishedDate),
        memberCount: 1,
        members: {
          create: { userId: user.id, status: "accepted" },
        },
      },
      include: {
        members: true,
      },
    });

    res.status(201).json({ community });
  } catch (err) {
    console.error(err);
    if (err.code === "P2003") {
      return res
        .status(400)
        .json({ error: "Invalid user: user not found in database" });
    }
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

/**
 * List communities user can join (not already a member)
 */
router.get("/available", async (req, res) => {
  const { clerkUserId } = req.query;
  if (!clerkUserId)
    return res.status(400).json({ error: "clerkUserId required" });

  const user = await prisma.user.findFirst({ where: { clerkUserId } });
  if (!user) return res.status(404).json({ error: "User not found" });

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

/**
 * User requests to join a community
 */
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
    // FIX: Add user as community member with status "pending", do NOT increment memberCount here!
    const newMember = await prisma.communityMember.create({
      data: {
        communityId,
        userId: dbUserId,
        status: "pending",
      },
    });

    // Do NOT increment community memberCount here!

    res
      .status(201)
      .json({ message: "Request to join community submitted", member: newMember });
  } catch (err) {
    console.error(err);
    if (err.code === "P2003") {
      return res.status(400).json({ error: "Invalid community or user" });
    }
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

/**
 * List communities the user has joined
 */
router.get("/joined", async (req, res) => {
  const { clerkUserId } = req.query;

  const user = await prisma.user.findFirst({ where: { clerkUserId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  const dbUserId = user.id;
  const joinedCommunities = await prisma.communityMember.findMany({
    where: { userId: dbUserId },
    include: { community: true },
  });

  // Include status from the membership
  res.json({
    communities: joinedCommunities.map((cm) => ({
      ...cm.community,
      status: cm.status,
    })),
  });
});

module.exports = router;