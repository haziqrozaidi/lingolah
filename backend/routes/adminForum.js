var express = require("express");
var router = express.Router();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const cors = require('cors');
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
// Apply CORS ONLY to this router
router.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
function requireAdmin(req, res, next) {
  next();
}

// Get details of a report for a post
router.get("/posts/:postId/report", async (req, res) => {
  const { postId } = req.params;
  try {
    const report = await prisma.report.findFirst({
      where: { postId },
      include: { reporter: true }, // If you want user details
      orderBy: { dateReported: 'desc' }
    });
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all reported posts that still need to be resolved
router.get("/reported/pending", requireAdmin, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { reported: true},
      include: { user: true },
      orderBy: { date: "desc" },
    });
    console.log(posts);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all reported posts that have been resolved
router.get("/reported/resolved", requireAdmin, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { reported: false, reportResolved: true },
      include: { user: true },
      orderBy: { date: "desc" },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get details of a single reported post
router.get("/reported/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!post || !post.reported)
      return res.status(404).json({ error: "Reported post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve a reported post (mark as not reported and resolved, add notes)
router.post("/moderate/:id/approve", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const post = await prisma.post.update({
      where: { id },
      data: {
        reported: false,
        reportResolved: true,
        moderationNote: notes || null,
      },
    });
    res.json({ message: "Post approved", post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a reported post (add moderation note, then delete)
router.post('/moderate/:id/delete', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    await prisma.post.update({
      where: { id },
      data: { moderationNote: notes || null, reportResolved: true }
    });

    // Now delete the post
    await prisma.post.delete({ where: { id } });

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Optionally, mark as resolved without approving or deleting (for admin flexibility)
router.post("/moderate/:id/resolve", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const post = await prisma.post.update({
      where: { id },
      data: {
        reportResolved: true,
        moderationNote: notes || null,
      },
    });
    res.json({ message: "Post marked as resolved", post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;