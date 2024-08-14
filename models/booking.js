import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  advisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencing User model for advisor information
  bookingDate: { type: Date, required: true },
  communicationMethod: { type: String, enum: ['Phone', 'Chat', 'Video', 'In-Person'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
