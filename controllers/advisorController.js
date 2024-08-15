import express from 'express';
import User from '../models/user.js';  // Adjust the import path as necessary

const router = express.Router();

export const getAllAdvisors = async (req, res) => {
    try {
      const advisors = await User.find({ role: 'Advisor' }, 'profilePicture specialization name hourlyRate availability');
      res.json(advisors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Display Detailed Advisor Information
  export const getAdvisorDetails = async (req, res) => {
    const { advisorId } = req.params;
    try {
      const advisor = await User.findById(advisorId, 'profilePicture specialization name hourlyRate availability reviews');
      if (!advisor) return res.status(404).json({ message: 'Advisor not found' });
      res.json(advisor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  