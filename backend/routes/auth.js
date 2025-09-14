const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth')
const apiLimiter = require('../middleware/rateLimiter')
const {
    registerUser,
    loginUser,
    getUserProfile,
} = require('../controller/auth');


router.post('/register', apiLimiter, registerUser);

router.post('/login', apiLimiter, loginUser);

router.get('/profile', protect, getUserProfile);

module.exports = router;
