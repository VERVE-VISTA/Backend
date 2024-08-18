import express from 'express';
import Payment from '../models/payment.js';  // Adjust the import path as necessary

const router = express.Router();

export const makePayment = async (req, res) => {
    const { bookingId, amount, cardNumber } = req.body;
    try {
      // Validate card number length (assuming simple validation here)
      if (cardNumber.length !== 16) {
        return res.status(400).json({ message: 'Invalid credit card number' });
      }
  
      const payment = new Payment({
        bookingId,
        amount,
        paymentMethod: 'CreditCard',
        status: 'Success'
      });
  
      await payment.save();
      res.status(201).json({ message: 'Payment successful', payment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };