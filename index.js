import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import newsRoutes from './src/routes/newsRoutes.js';
import offerRoutes from './src/routes/offerRoutes.js'

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the app
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));

// Default route for root path
app.get('/', (req, res) => {
    res.send('Server is up and running.');
  });
  

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', newsRoutes);
app.use('/api', offerRoutes)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
