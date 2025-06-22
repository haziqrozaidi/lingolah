var express = require("express");
var router = express.Router();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// Get all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true },
      orderBy: { date: "desc" },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a post
router.post("/posts", async (req, res) => {
  const { title, content, category, userId } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request body" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return res.status(400).json({ error: "User not found" });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        userId: user.id,
        viewCount: 0,
        date: new Date(),
      },
    });
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);  // <-- Add this for debugging
    res.status(500).json({ error: err.message });
  }
});

// Update a post
router.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;
  try {
    const updated = await prisma.post.update({
      where: { id },
      data: { title, content, category },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a post
router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/*RERPORTING SECTION*/
// Report a post
router.post("/posts/:id/report", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { reported: true },
    });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Get all reported posts (for admin)
router.get("/posts/reported", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { reported: true },
      include: { user: true },
      orderBy: { date: "desc" },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;