import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['User', 'Advisor'], required: true },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
  // Advisor-specific fields
  name: {
    type: String,
    required: function() {
      return this.role === 'Advisor';
    }
  },
  specialization: {
    type: String,
    required: function() {
      return this.role === 'Advisor';
    }
  },
  hourlyRate: {
    type: Number,
    required: function() {
      return this.role === 'Advisor';
    }
  },
  availability: {
    type: [String],  // Changed from String to Array of Strings
    required: function() {
      return this.role === 'Advisor';
    }
  },

  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String }
  }],
  // Flattened advisor-specific fields
  servicesOffered: {
    type: String,
    required: function() {
      return this.role === 'Advisor';
    }
  },
  consultationPackageName: {
    type: String,
    required: function() {
      return this.role === 'Advisor';
    }
  },
  consultationPackagePrice: {
    type: Number,  // Use Number type for price
    required: function() {
      return this.role === 'Advisor';
    }
  },
  consultationPackageDescription: {
    type: String,
    required: function() {
      return this.role === 'Advisor';
    }
  }
});

// Applying conditional validation for Advisor-specific fields
userSchema.path('name').validate(function(value) {
  if (this.role === 'Advisor' && !value) {
    return false;
  }
  return true;
}, 'Name is required for advisors');

userSchema.path('specialization').validate(function(value) {
  if (this.role === 'Advisor' && !value) {
    return false;
  }
  return true;
}, 'Specialization is required for advisors');

userSchema.path('hourlyRate').validate(function(value) {
  if (this.role === 'Advisor' && (value === undefined || value === null)) {
    return false;
  }
  return true;
}, 'Hourly rate is required for advisors');

userSchema.path('availability').validate(function(value) {
  if (this.role === 'Advisor' && !value) {
    return false;
  }
  return true;
}, 'Availability is required for advisors');

userSchema.path('servicesOffered').validate(function(value) {
  if (this.role === 'Advisor' && !value) {
    return false;
  }
  return true;
}, 'Services offered is required for advisors');

userSchema.path('consultationPackageName').validate(function(value) {
  if (this.role === 'Advisor' && !value) {
    return false;
  }
  return true;
}, 'Consultation package name is required for advisors');

userSchema.path('consultationPackagePrice').validate(function(value) {
  if (this.role === 'Advisor' && (value === undefined || value === null)) {
    return false;
  }
  return true;
}, 'Consultation package price is required for advisors');

userSchema.path('consultationPackageDescription').validate(function(value) {
  if (this.role === 'Advisor' && !value) {
    return false;
  }
  return true;
}, 'Consultation package description is required for advisors');

const User = mongoose.model('User', userSchema);
export default User;
