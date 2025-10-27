const express = require('express');
const performanceController = require('../controllers/performanceController');

const router = express.Router();

// Get district performance data
// GET /api/performance/:state/:district
router.get('/:state/:district', performanceController.getDistrictPerformance);

// Compare multiple districts
// POST /api/performance/compare
router.post('/compare', performanceController.compareDistricts);

// Get trending data
// GET /api/performance/trends
router.get('/trends', performanceController.getTrendingData);

// Get top performing districts
// GET /api/performance/top
router.get('/top', performanceController.getTopPerformers);

module.exports = router;