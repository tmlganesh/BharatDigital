const mongoose = require('mongoose');

const stateDistrictSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  districts: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: false,
      trim: true
    }
  }],
  state_code: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'state_districts'
});

// Index for better query performance
stateDistrictSchema.index({ 'districts.name': 1 });

// Static method to get all states
stateDistrictSchema.statics.getAllStates = function() {
  try {
    return this.find({}, { state: 1, state_code: 1, _id: 0 }).sort({ state: 1 });
  } catch (error) {
    console.error('StateDistrict.getAllStates error:', error && error.stack ? error.stack : error);
    throw error;
  }
};

// Static method to get districts by state
stateDistrictSchema.statics.getDistrictsByState = function(stateName) {
  return this.findOne({ state: stateName }, { districts: 1, _id: 0 });
};

// Static method to search districts
stateDistrictSchema.statics.searchDistricts = function(searchTerm) {
  return this.aggregate([
    { $unwind: '$districts' },
    {
      $match: {
        'districts.name': { $regex: searchTerm, $options: 'i' }
      }
    },
    {
      $project: {
        state: 1,
        district: '$districts.name',
        _id: 0
      }
    },
    { $sort: { state: 1, district: 1 } }
  ]);
};

const StateDistrict = mongoose.model('StateDistrict', stateDistrictSchema);

module.exports = StateDistrict;