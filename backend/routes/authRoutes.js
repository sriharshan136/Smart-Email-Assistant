import dotenv from 'dotenv';
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET; // Replace with an environment variable in production

// Signup Endpoint
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
