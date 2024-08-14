import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Refers to the advisor (who is also a user)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },    // Refers to the user writing the review
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Applying validation to ensure that the referenced advisor has the role 'Advisor'
reviewSchema.path('advisor').validate(function(value) {
  return mongoose.model('User').findById(value).then(user => {
    if (user && user.role === 'Advisor') {
      return true;
    }
    return false;
  }).catch(() => false);
}, 'The advisor field must reference a User with the role of Advisor');

const Review = mongoose.model('Review', reviewSchema);
export default Review;
