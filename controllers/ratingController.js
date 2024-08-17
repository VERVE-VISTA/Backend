import Review from '../models/review.js';  // Adjust the import path as necessary

// Add Rating to an Advisor
export const addRating = async (req, res) => {
    const { userId, advisorId } = req.params;  // Retrieve userId and advisorId from URL parameters
    const { rating, comment } = req.body;

    try {
        // Validate required fields
        if (!userId || !rating) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate rating is a number between 1 and 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Create a new review
        const review = new Review({ advisor: advisorId, user: userId, rating, comment });
        await review.save();

        // Respond with success message
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Ratings for an Advisor
export const getAdvisorRatings = async (req, res) => {
    const { advisorId } = req.params;

    try {
        // Find all reviews for the advisor
        const reviews = await Review.find({ advisor: advisorId });

        // If no reviews found, respond with a message
        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No ratings found for this advisor' });
        }

        // Calculate the average rating
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        // Respond with the ratings and average
        res.status(200).json({ ratings: reviews.map(review => review.rating), averageRating });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
