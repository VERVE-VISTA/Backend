import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';  // Adjust the import path as necessary
import config from '../config.js';  // Importing your configuration

const router = express.Router();
const JWT_SECRET = config.JWT_SECRET;  // Access the secret from your config file

// Sign-Up Controller for Regular Users
export const signup = async (req, res) => {
  const { username, password, name, specialization, hourlyRate, availability } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      role: 'User',  // Automatically set role as User
      name,
      specialization,
      hourlyRate,
      availability
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sign-In Controller for Regular Users
export const signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sign-Up Controller for Advisors
export const signupAdvisor = async (req, res) => {
  const { username, password, name, specialization, hourlyRate, availability } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const advisor = new User({
      username,
      password: hashedPassword,
      role: 'Advisor',  // Automatically set role as Advisor
      name,
      specialization,
      hourlyRate,
      availability
    });
    await advisor.save();
    res.status(201).json({ message: 'Advisor created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sign-In Controller for Advisors
export const signinAdvisor = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.role !== 'Advisor' || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials or not an advisor' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default router;
