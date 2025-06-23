var express = require("express");
var router = express.Router();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

router.get("/:userId", async (req, res) => {
  const dbUserId = req.params.userId;
  try {
    // 1. Look up in your DB
    const localUser = await prisma.user.findUnique({ where: { id: dbUserId } });
    if (!localUser || !localUser.clerkUserId) {
      return res.status(404).json({ error: "User not found in DB" });
    }
    const clerkUserId = localUser.clerkUserId;

    // 2. Fetch from Clerk API
    const clerkRes = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const text = await clerkRes.text();
    if (!clerkRes.ok) {
      return res.status(404).json({ error: "User not found in Clerk", details: text });
    }
    const clerkUser = JSON.parse(text);

    res.json({
      username: clerkUser.username || clerkUser.first_name || "User",
      imageUrl: clerkUser.image_url || null,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user", message: err.message });
  }
});

module.exports = router;
