var express = require('express');
var router = express.Router();
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Helper to get user by clerkUserId and return DB user id (and username if needed)
async function findUserByClerkId(clerkUserId) {
  if (!clerkUserId) return null;
  return await prisma.user.findFirst({ where: { clerkUserId } });
}

module.exports = { findUserByClerkId };