const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present',
    },
    class: {
      type: String,
      required: true,
    },
    qrCodeUsed: {
      type: String, 
      required: true,
    },
    selfieUrl: {
      type: String, 
      default: null,
    },
    deviceId: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    remarks: {
      type: String, 
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance
