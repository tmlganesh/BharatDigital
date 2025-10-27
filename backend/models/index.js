const mongoose = require('mongoose');

// Export all models
const PerformanceData = require('./PerformanceData');
const StateDistrict = require('./StateDistrict');

module.exports = {
  PerformanceData,
  StateDistrict
};