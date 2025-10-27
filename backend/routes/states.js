const express = require('express');
const stateController = require('../controllers/stateController');

const router = express.Router();

// Get all states
// GET /api/states
router.get('/', stateController.getAllStates);

// Get state statistics
// GET /api/states/statistics
router.get('/statistics', stateController.getStateStatistics);

// Search districts across all states
// GET /api/states/search?q=searchterm
router.get('/search', stateController.searchDistricts);

module.exports = router;