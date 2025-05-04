import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    personal_id: {
        type: String,
        required: true,
        index: true
    },
    user_image: {
        type: String,
        default: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Alexander",
    },
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
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
        index: true
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
})

userSchema.index({ "personal_id": 1, "email": 1 })

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Users", userSchema)