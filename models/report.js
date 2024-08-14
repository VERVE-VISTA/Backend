import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Refers to the user reporting the advisor
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Refers to the advisor (who is also a user)
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// Applying validation to ensure that the referenced advisor has the role 'Advisor'
reportSchema.path('advisor').validate(function(value) {
  return mongoose.model('User').findById(value).then(user => {
    if (user && user.role === 'Advisor') {
      return true;
    }
    return false;
  }).catch(() => false);
}, 'The advisor field must reference a User with the role of Advisor');

const Report = mongoose.model('Report', reportSchema);
export default Report;
