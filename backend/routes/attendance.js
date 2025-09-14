const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const apiLimiter  = require('../middleware/rateLimiter')
const {
  markAttendance,
  getAllAttendance,
  getAttendanceById,
  getUserAttendanceHistory,
  getTodayAttendance,
  updateAttendance,
  deleteAttendance,
} = require('../controller/attendance');

router.post('/mark', protect, markAttendance);

router.get('/', protect, getAllAttendance);

router.get('/:id', protect, getAttendanceById);

router.get('/user/:userId', protect, getUserAttendanceHistory);

router.get('/today', protect, getTodayAttendance);

router.put('/:id', protect, updateAttendance);

router.delete('/:id', protect, deleteAttendance);

module.exports = router;
