const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
      unique: true, 
    },
    deviceName: {
      type: String,
      default: 'Unknown Device',
    },
    ipAddress: {
      type: String,
      default: null,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
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

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
