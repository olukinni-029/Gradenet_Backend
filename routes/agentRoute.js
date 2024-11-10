const express = require('express');
const router = express.Router();
const Agent = require('../models/agentModel');

// Route to handle form submission
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, location, region, hearAboutUs, password, confirmPassword, agree } = req.body;

  // Validation for required fields
  if (!firstName || !lastName || !email || !phone || !location || !region || !hearAboutUs || !password || !confirmPassword || !agree) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the agent already exists by email
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ error: "Agent with this email already exists" });
    }

    // Create a new agent and save to the database
    const newAgent = new Agent({
      firstName,
      lastName,
      email,
      phone,
      location,
      region,
      hearAboutUs,
      password,
      confirmPassword,
      agree
    });

    await newAgent.save();
    res.status(201).json({ message: "Agent successfully registered!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/agents', async (req, res) => {
    try {
      // Fetch all agents from the database
      const agents = await Agent.find();
      
      // Respond with the list of agents
      res.status(200).json(agents);
    } catch (error) {
      // Send an error response if something goes wrong
      res.status(500).json({ message: "An error occurred while fetching agents", error: error.message });
    }
  });

module.exports = router;
