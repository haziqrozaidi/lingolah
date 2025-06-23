var express = require("express");
var router = express.Router();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const cors = require('cors');

// Apply CORS ONLY to this router
router.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
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
  const { title, content, category, userId, communityId } = req.body;
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
        communityId: communityId || null,
      },
    });
    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err); // <-- Add this for debugging
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

/*LIKE & COMMENT SECTION*/
// Like or Unlike a post (toggle)
router.post("/posts/:postId/like", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) {
      await prisma.like.delete({
        where: { postId_userId: { postId, userId } },
      });
      return res.json({ liked: false });
    } else {
      await prisma.like.create({ data: { postId, userId } });
      return res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Like action failed." });
  }
});

// Get like count & if liked by current user
router.get("/posts/:postId/like-status", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.query;
  const count = await prisma.like.count({ where: { postId } });
  const liked = !!(await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  }));
  res.json({ count, liked });
});

// Add comment to post (multiple comments per user/post allowed)
router.post("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { userId, content } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: { postId, userId, content },
    });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Comment action failed." });
  }
});

// Get all comments for a post
router.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
  res.json(comments);
});

/*VIEW COUNT SECTION*/
router.post("/posts/:id/view", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get a single post
router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==== Report a post (USER FACING ENDPOINT) ====
router.post("/posts/:id/report", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, details, reporterId } = req.body;
    console.log("Report Attempt: ", { id, reason, details, reporterId });

    if (!reason) return res.status(400).json({ error: "Reason required" });

    // 1. CREATE THE REPORT RECORD
    const report = await prisma.report.create({
      data: {
        postId: id,
        reason,
        details,
        reporterId: reporterId || null
      }
    });
    console.log("Report CREATED: ", report);

    // 2. MARK THE POST AS REPORTED
    const updated = await prisma.post.update({
      where: { id },
      data: { reported: true }
    });
    console.log("Post updated: ", updated);

    res.json({ message: "Report submitted!", report });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
