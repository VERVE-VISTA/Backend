// advisorController.js
import Review from '../models/review.js';  // Adjust the import path as necessary

// Add Rating to an Advisor
export const addRating = async (req, res) => {
    const { userId, advisorId, rating, comment } = req.body;
    try {
        const review = new Review({ advisor: advisorId, user: userId, rating, comment });
        await review.save();
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
