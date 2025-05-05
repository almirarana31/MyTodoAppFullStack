// models/user.js
import { sequelize } from '../db/connection.js';

const User = sequelize.define('User', {
  personal_id: {
    type: String,
    required: true,
  },
  user_image: {
    type: String,
    default: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Alexander",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    default: "",
    maxLength: [500, 'Bio cannot exceed 500 characters'],
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ""
  },
  phone_number: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
  },
  verificationExpires: {
    type: Date,
    default: null
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: {
    createdAt: 'joinedAt'
  }
});

export default User;