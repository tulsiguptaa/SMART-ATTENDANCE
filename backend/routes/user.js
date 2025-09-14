const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const apiLimiter  = require('../middleware/rateLimiter');

const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controller/user');

// All routes are protected
router.use(protect);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
