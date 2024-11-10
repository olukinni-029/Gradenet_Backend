require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Define the port
const PORT = process.env.PORT || 8080;

// Define routes
app.use('/api/agents', require('./routes/agentRoute'));
app.use('/api',require('./routes/preOrderRoute'));

app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;
  
    // Example: send an email notification (using Nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services or SMTP
      auth: {
        user: process.env.NODEMAILER_EMAIL, 
        pass: process.env.NODEMAILER_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: 'ola@yopmail.com', // Change to your contact email
      subject: 'New Contact Form Submission',
      text: `You have a new message from ${name} (${email}):
      
      Phone: ${phone}
      Message: ${message}`,
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email error:", err.message);
        return res.status(500).json({ message: 'Error sending message' });
      }
      console.log(`${new Date().toLocaleString()} - Email sent successfully:` +
        info.response);
      return res.status(200).json({ message: 'Message sent successfully' });
    });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
