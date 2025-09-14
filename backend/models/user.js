const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['student', 'teacher', 'admin'],
            default: 'student',
        },
        rollNumber: {
            type: String,
            unique: true,
            required: true,
        },
        class: {
            type: String,
        },
        phone: {
            type: String,
        },
        parentEmail: {
            type: String,
        },
        deviceId: {
            type: String,
            unique: true,
            sparse: true,
        },
        fingerprintData: {
            type: String,
            default: null,
        },
        selfieUrl: {
            type: String,
            default: null,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
