import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';  // Adjust the import path as necessary
import config from '../config.js';  // Importing your configuration
import upload from '../middlewares/multer.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
// Sign-In Controller for Regular Users
export const signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Sign-Up Controller for Advisors
export const signupAdvisor = async (req, res) => {
  upload.single('profilePicture')(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    const { username, password, name, specialization, hourlyRate, availability } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const advisor = new User({
        username,
        password: hashedPassword,
        role: 'Advisor',
        name,
        specialization,
        hourlyRate,
        availability,
        profilePicture: req.file ? req.file.path : undefined  // Save image path
      });
      await advisor.save();
      res.status(201).json({ message: 'Advisor created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
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
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default router;


// Fetch User Profile Controller
export const getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Optionally, you can exclude sensitive fields like password
    const { password, ...userProfile } = user.toObject();
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
};

export const searchAdvisors = async (req, res) => {
  const { keyword } = req.body;  // Extracting the keyword from the request body

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    // Find advisors where the name or specialization matches the keyword
    const advisors = await User.find({
      role: 'Advisor',
      $or: [
        { name: { $regex: keyword, $options: 'i' } },  // Case-insensitive regex search in name
        { specialization: { $regex: keyword, $options: 'i' } }  // Case-insensitive regex search in specialization
      ]
    })
      .select('name specialization profilePicture reviews') // Select only necessary fields
      .populate({
        path: 'reviews',
        select: 'rating', // Only fetch the rating from reviews
      });

    if (advisors.length === 0) {
      return res.status(404).json({ message: 'No advisors found' });
    }

    // Format the data to include average ratings
    const formattedAdvisors = advisors.map(advisor => {
      const averageRating = advisor.reviews.length > 0
        ? advisor.reviews.reduce((acc, review) => acc + review.rating, 0) / advisor.reviews.length
        : 0;

      return {
        name: advisor.name,
        specialization: advisor.specialization,
        profilePicture: advisor.profilePicture,
        averageRating: averageRating.toFixed(1), // Calculate the average rating
      };
    });

    res.status(200).json(formattedAdvisors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getAdvisors = async (req, res) => {
  try {
    // Fetch all users with the role of 'Advisor'
    const advisors = await User.find({ role: 'Advisor' })
      .select('name specialization profilePicture reviews') // Select only necessary fields
      .populate({
        path: 'reviews',
        select: 'rating', // Only fetch the rating from reviews
      });

    // Format the data to include average ratings
    const formattedAdvisors = advisors.map(advisor => {
      const averageRating = advisor.reviews.length > 0
        ? advisor.reviews.reduce((acc, review) => acc + review.rating, 0) / advisor.reviews.length
        : 0;

      return {
        name: advisor.name,
        specialization: advisor.specialization,
        profilePicture: advisor.profilePicture,
        averageRating: averageRating.toFixed(1), // Calculate the average rating
      };
    });

    res.status(200).json(formattedAdvisors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sortAdvisorsByRatingDesc = async (req, res) => {
  try {
    // Fetch all users with the role of 'Advisor'
    const advisors = await User.find({ role: 'Advisor' })
      .select('name specialization profilePicture reviews') // Select only necessary fields
      .populate({
        path: 'reviews',
        select: 'rating', // Only fetch the rating from reviews
      });

    // Format the data to include average ratings
    const formattedAdvisors = advisors.map(advisor => {
      const averageRating = advisor.reviews.length > 0
        ? advisor.reviews.reduce((acc, review) => acc + review.rating, 0) / advisor.reviews.length
        : 0;

      return {
        name: advisor.name,
        specialization: advisor.specialization,
        profilePicture: advisor.profilePicture,
        averageRating: parseFloat(averageRating.toFixed(1)), // Calculate and format the average rating
      };
    });

    // Sort the advisors in descending order by average rating
    formattedAdvisors.sort((a, b) => b.averageRating - a.averageRating);

    res.status(200).json(formattedAdvisors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserImage = (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, '..', 'uploads', imageName);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Image not found: ${imagePath}`);
      return res.status(404).json({ error: 'Image not found' });
    }
    res.sendFile(imagePath);
  });
};