const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const { default: mongoose } = require('mongoose');


// Load environment variables
dotenv.config({ path: './config/.env' });

// Check if MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes); // Ensure this line exists
app.use('/api/memory', memoryRoutes);


// Connect to MongoDB
connectDB();

// Default Route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
