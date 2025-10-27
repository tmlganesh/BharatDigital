const express = require('express');
const stateController = require('../controllers/stateController');

const router = express.Router();

// Get districts by state
// GET /api/districts/:state
router.get('/:state', stateController.getDistrictsByState);

module.exports = router;