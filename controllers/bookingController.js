import express from 'express';
import Booking from '../models/booking.js';  // Adjust the import path as necessary

const router = express.Router();

// Book an Advisor
export const bookAdvisor = async (req, res) => {
  const { userId, advisorId, bookingDate, communicationMethod } = req.body;
  
  try {
    const booking = new Booking({
      userId,
      advisorId,
      bookingDate,
      communicationMethod,
      paymentStatus: 'Pending'
    });

    await booking.save();

    // Include the bookingId in the response
    res.status(201).json({ 
      message: 'Booking created successfully', 
      bookingId: booking._id,  // Assuming you're using MongoDB, booking._id will be the bookingId
      booking 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
