import express from 'express';
import Report from '../models/report.js';  // Adjust the import path as necessary

const router = express.Router();

export const reportAdvisor = async (req, res) => {
    const { reporter, advisor, description } = req.body;
    try {
      const report = new Report({ reporter, advisor, description });
      await report.save();
      res.status(201).json({ message: 'Report submitted successfully', report });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };