var express = require('express');
var router = express.Router();
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST sync user data from Clerk */
router.post('/sync', async function(req, res, next) {
  try {
    // Extract user data from request body
    const { clerkUserId, username, email, role } = req.body;

    // Log received data (for development/debugging)
    console.log('User data received:', { clerkUserId, username, email, role });

    if (!clerkUserId || !username || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required user data fields'
      });
    }

    // Check if user with this Clerk ID already exists
    const existingUser = await prisma.user.findFirst({
      where: { clerkUserId: clerkUserId }
    });

    let user;
    
    if (existingUser) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          clerkUserId,
          username,
          email,
          role
        }
      });
      
      console.log('Updated existing user:', user.id);
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          clerkUserId,
          username,
          email,
          role
        }
      });
      
      console.log('Created new user:', user.id);
    }

    // Return success response with user data
    res.status(200).json({
      success: true,
      message: existingUser ? 'User data updated successfully' : 'User created successfully',
      timestamp: new Date().toISOString(),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Error processing user data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process user data',
      error: error.message
    });
  }
});
// Express route
router.get("/by-clerk-id/:clerkUserId", async (req, res) => {
  const { clerkUserId } = req.params;
  const user = await prisma.user.findFirst({ where: { clerkUserId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json({ id: user.id, username: user.username });
});
module.exports = router;
