const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json()); 

// Basic test route to check if API is running
app.get('/', (req, res) => {
    res.send('Netflix Clone API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    
    // Start the server ONLY after the database connects
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error.message);
  });