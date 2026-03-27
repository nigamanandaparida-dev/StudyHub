
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import memeRoutes from './routes/memes.js';
import adminRoutes from './routes/admin.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/memes', memeRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('StudyHub API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('--- GLOBAL ERROR TRIGGERED ---');
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  if (err.stack) {
    console.error(err.stack);
  } else {
    console.error('Error Object:', err);
  }
  console.error('----------------------------');
  res.status(500).json({ 
    message: 'Internal Server Error',
    details: err.message || 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
