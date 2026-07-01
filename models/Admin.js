import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username.'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email.'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      minlength: [6, 'Password must be at least 6 characters long.'],
    },
    fullName: {
      type: String,
      required: [true, 'Please provide the admin full name.'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for account lock status
AdminSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save hook to hash password
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to handle login attempts
AdminSchema.methods.recordLoginAttempt = async function (success) {
  if (!success) {
    this.loginAttempts += 1;
    
    // Lock account after 5 failed attempts
    if (this.loginAttempts >= 5) {
      this.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
    }
  } else {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    this.lastLogin = Date.now();
  }

  await this.save();
};

// Static method to find admin by credentials
AdminSchema.statics.findByCredentials = async function (emailOrUsername, password) {
  const admin = await this.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  }).select('+password +loginAttempts +lockUntil');

  if (!admin) return null;

  // Check if account is locked
  if (admin.isLocked) {
    throw new Error('Account is temporarily locked. Please try again later.');
  }

  const isValidPassword = await admin.comparePassword(password);
  if (!isValidPassword) {
    await admin.recordLoginAttempt(false);
    throw new Error('Invalid credentials.');
  }

  await admin.recordLoginAttempt(true);
  return admin;
};

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);