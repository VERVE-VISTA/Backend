import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['CreditCard'], required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Success', 'Failed'], required: true }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
