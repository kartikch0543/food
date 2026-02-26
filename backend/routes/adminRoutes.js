const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');
const { protect, admin, owner } = require('../middleware/authMiddleware');

// Allow both admin and owner to access stats
router.get('/stats', protect, owner, getAdminStats);

module.exports = router;
