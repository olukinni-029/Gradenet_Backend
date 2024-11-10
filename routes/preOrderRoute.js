const express = require('express');
const router = express.Router();
const PreOrder = require('../models/preOrderModel');

router.post("/pre-order", async (req, res) => {
    const { fullName, email, phoneNumber, location, homeType, gpsAddress, installationDate, agentName, package } = req.body;
  
    // Validate the data
    if (!fullName || !email || !phoneNumber || !location || !homeType || !gpsAddress || !installationDate || !agentName || !package) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingOrder = await PreOrder.findOne({ email });
    if (existingOrder) {
      return res
        .status(400)
        .json({ message: `Order with ${email} already exists` });
    }
  
    try {
      // Create a new PreOrder document
      const newPreOrder = new PreOrder({
        fullName,
        email,
        phoneNumber,
        location,
        homeType,
        gpsAddress,
        installationDate,
        agentName,
        package
      });
  
      // Save the document to the database
      await newPreOrder.save();
  
      // Send a success response
      res.status(201).json({ message: "Pre-order submitted successfully", preOrder: newPreOrder });
    } catch (error) {
      console.error("Error submitting pre-order:", error);
      res.status(500).json({ message: "There was an error submitting the pre-order. Please try again." });
    }
  });

  module.exports = router;