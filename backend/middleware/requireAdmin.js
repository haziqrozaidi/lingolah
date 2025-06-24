var express = require("express");
var router = express.Router();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function requireAdmin(req, res, next) {
  const userId = req.auth?.userId; // Secure! Set by Clerk middleware
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await prisma.user.findFirst({ where: { clerkUserId: userId } });
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  req.dbUser = user;
  next();
}

module.exports = requireAdmin;