import express from 'express';
import { signup, signin, signupAdvisor, signinAdvisor, getProfile } from '../controllers/userController.js';
import {
  getAllAdvisors,
  getAdvisorDetails,
} from '../controllers/advisorController.js';
import { sortAdvisorsByRatingDesc } from '../controllers/userController.js';
import { sendMessageFromUserToAdvisor,sendMessageFromAdvisorToUser,getMessagesBetweenUserAndAdvisor,getMessagesBetweenAdvisorAndUser } from '../controllers/chatController.js'; // Adjust path as necessary


import {  reportAdvisor} from '../controllers/reportController.js';
import {bookAdvisor} from '../controllers/bookingController.js';
import {makePayment} from '../controllers/paymentController.js';
import { addRating, getAdvisorRatings } from '../controllers/ratingController.js';  // Ensure path is correct
import {getAdvisors,searchAdvisors,getAdvisor} from '../controllers/userController.js';
import { getUserImage,getSuccessfulPaymentsAndUsers } from '../controllers/userController.js';

const router = express.Router();

// Auth Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signupAd', signupAdvisor);
router.post('/signinAd', signinAdvisor);
// Advisor Routes
router.get('/listadvisors', getAdvisors);
router.get('/advisors', getAllAdvisors);
router.get('/advisors/:advisorId', getAdvisorDetails);
router.post('/advisors/book', bookAdvisor);
router.post('/advisors/rate/:userId/:advisorId', addRating);
router.get('/advisors/:advisorId/ratings', getAdvisorRatings);
router.get('/advisors/sort/desc', sortAdvisorsByRatingDesc);
// Route for fetching user profile
router.get('/profile/:userId', getProfile);
router.post('/advisors/search', searchAdvisors);
router.post('/advisors/report', reportAdvisor);
router.get('/image/:imageName', getUserImage);
router.get('/advisor/:advisorId', getAdvisor);
// Payment Route
router.post('/payment', makePayment);
// Messaging routes
router.post('/sendMessage/userToAdvisor', sendMessageFromUserToAdvisor);
router.post('/sendMessage/advisorToUser', sendMessageFromAdvisorToUser);
router.get('/messages/user/:userId/advisor/:advisorId', getMessagesBetweenUserAndAdvisor);
router.get('/messages/advisor/:advisorId/user/:userId', getMessagesBetweenAdvisorAndUser);
router.get('/advisor/:advisorId/payments', getSuccessfulPaymentsAndUsers);

export default router;
