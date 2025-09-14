const Attendance = require('../models/attendance');
const Device = require('../models/device');
const User = require('../models/user');


const markAttendance = async (req, res) => {
  try {
    const { qrCode, selfieUrl, deviceId } = req.body;
    const userId = req.user._id;

    const registeredDevice = await Device.findOne({ userId, deviceId });
    if (!registeredDevice) {
      return res.status(400).json({ message: 'Device not registered' });
    }

    const isQrValid = true; 
    if (!isQrValid) {
      return res.status(400).json({ message: 'Invalid or expired QR code' });
    }

    const isSelfieValid = true;
    if (!isSelfieValid) {
      return res.status(400).json({ message: 'Selfie verification failed' });
    }

    const attendance = await Attendance.create({
      userId,
      date: new Date(),
      status: 'present',
      class: req.body.class || 'default',
      qrCodeUsed: qrCode,
      selfieUrl: selfieUrl || null,
      deviceId,
      verified: true,
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance,
    });
  } catch (error) {
    console.error('Mark Attendance Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({})
      .populate('userId', 'name email') 
      .sort({ date: -1 });

    res.json({ success: true, attendanceRecords });
  } catch (error) {
    console.error('Get All Attendance Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate(
      'userId',
      'name email'
    );
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json({ success: true, attendance });
  } catch (error) {
    console.error('Get Attendance By ID Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getUserAttendanceHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const attendanceHistory = await Attendance.find({ userId }).sort({
      date: -1,
    });

    res.json({ success: true, attendanceHistory });
  } catch (error) {
    console.error('Get User Attendance History Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getTodayAttendance = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysAttendance = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate('userId', 'name email');

    res.json({ success: true, todaysAttendance });
  } catch (error) {
    console.error('Get Today Attendance Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    res.json({ success: true, message: 'Attendance updated', attendance });
  } catch (error) {
    console.error('Update Attendance Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    res.json({ success: true, message: 'Attendance deleted' });
  } catch (error) {
    console.error('Delete Attendance Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  deleteAttendance,
  updateAttendance,
  getTodayAttendance,
  getUserAttendanceHistory,
  getAttendanceById,
  getAllAttendance,
  markAttendance,
}