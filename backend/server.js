import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import emailRoutes from './routes/emailRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mount Routes
app.use('/api/emails', emailRoutes);
app.use('/api/auth', authRoutes);

// MongoDB connection (update with your credentials)
const uri = 'mongodb+srv://sriharshan136:watermelon@cluster1.meeij.mongodb.net/?appName=Cluster1';

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
