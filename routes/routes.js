import express from 'express';
import { signup, signin } from '../controllers/userController.js';
import {
  getAllAdvisors,
  getAdvisorDetails,
} from '../controllers/advisorController.js';

import {  reportAdvisor} from '../controllers/reportController.js';
import {bookAdvisor} from '../controllers/bookingController.js';
import {makePayment} from '../controllers/paymentController.js';
import { addRating } from '../controllers/ratingController.js';
const router = express.Router();

// Auth Routes
router.post('/signup', signup);
router.post('/signin', signin);

// Advisor Routes
router.get('/advisors', getAllAdvisors);
router.get('/advisors/:advisorId', getAdvisorDetails);
router.post('/advisors/book', bookAdvisor);
router.post('/advisors/rate', addRating);
router.post('/advisors/report', reportAdvisor);

// Payment Route
router.post('/payment', makePayment);

export default router;
