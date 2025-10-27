const mongoose = require('mongoose');

const performanceDataSchema = new mongoose.Schema({
  fin_year: {
    type: String,
    required: true,
    index: true
  },
  month: {
    type: String,
    required: true,
    index: true
  },
  state_code: {
    type: String,
    required: true,
    index: true
  },
  state_name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  district_code: {
    type: String,
    required: true,
    index: true
  },
  district_name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  approved_labour_budget: {
    type: Number,
    default: 0
  },
  average_wage_rate_per_day: {
    type: Number,
    default: 0
  },
  average_days_of_employment: {
    type: Number,
    default: 0
  },
  differently_abled_persons_worked: {
    type: Number,
    default: 0
  },
  material_and_skilled_wages: {
    type: Number,
    default: 0
  },
  number_of_completed_works: {
    type: Number,
    default: 0
  },
  number_of_gps_with_nil_exp: {
    type: Number,
    default: 0
  },
  number_of_ongoing_works: {
    type: Number,
    default: 0
  },
  persondays_of_central_liability: {
    type: Number,
    default: 0
  },
  sc_persondays: {
    type: Number,
    default: 0
  },
  sc_workers_against_active_workers: {
    type: Number,
    default: 0
  },
  st_persondays: {
    type: Number,
    default: 0
  },
  st_workers_against_active_workers: {
    type: Number,
    default: 0
  },
  total_adm_expenditure: {
    type: Number,
    default: 0
  },
  total_exp: {
    type: Number,
    default: 0
  },
  total_households_worked: {
    type: Number,
    default: 0
  },
  total_individuals_worked: {
    type: Number,
    default: 0
  },
  total_active_job_cards: {
    type: Number,
    default: 0
  },
  total_active_workers: {
    type: Number,
    default: 0
  },
  total_hhs_completed_100_days: {
    type: Number,
    default: 0
  },
  total_job_cards_issued: {
    type: Number,
    default: 0
  },
  total_workers: {
    type: Number,
    default: 0
  },
  total_works_takenup: {
    type: Number,
    default: 0
  },
  wages: {
    type: Number,
    default: 0
  },
  women_persondays: {
    type: Number,
    default: 0
  },
  percent_category_b_works: {
    type: Number,
    default: 0
  },
  percent_expenditure_agriculture: {
    type: Number,
    default: 0
  },
  percent_nrm_expenditure: {
    type: Number,
    default: 0
  },
  percentage_payments_within_15_days: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String,
    default: ''
  },
  // Calculated fields for compatibility
  persondays_generated: {
    type: Number,
    default: 0
  },
  avg_wage_per_day: {
    type: Number,
    default: 0
  },
  total_expenditure: {
    type: Number,
    default: 0
  },
  ongoing_works: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'performance_data'
});

// Compound indexes for better query performance
performanceDataSchema.index({ state_name: 1, district_name: 1, fin_year: -1, month: -1 });
performanceDataSchema.index({ fin_year: -1, month: -1 });

// Pre-save middleware to calculate derived fields
performanceDataSchema.pre('save', function(next) {
  // Set compatibility fields
  this.persondays_generated = this.persondays_of_central_liability || 0;
  this.avg_wage_per_day = this.average_wage_rate_per_day || 0;
  this.total_expenditure = this.total_exp || 0;
  this.ongoing_works = this.number_of_ongoing_works || 0;
  
  next();
});

// Static methods for aggregations
performanceDataSchema.statics.getDistrictPerformance = function(state, district, year = null, month = null) {
  const query = { state_name: state, district_name: district };
  if (year) query.fin_year = year;
  if (month) query.month = month;
  
  return this.find(query).sort({ fin_year: -1, month: -1 }).limit(12);
};

performanceDataSchema.statics.getStateAverage = function(state, year, month) {
  return this.aggregate([
    { $match: { state_name: state, fin_year: year, month: month } },
    {
      $group: {
        _id: null,
        avg_households_worked: { $avg: '$total_households_worked' },
        avg_persondays_generated: { $avg: '$persondays_of_central_liability' },
        avg_wage_per_day: { $avg: '$average_wage_rate_per_day' },
        avg_expenditure: { $avg: '$total_exp' },
        avg_ongoing_works: { $avg: '$number_of_ongoing_works' },
        total_districts: { $sum: 1 }
      }
    }
  ]);
};

performanceDataSchema.statics.getNationalAverage = function(year, month) {
  return this.aggregate([
    { $match: { fin_year: year, month: month } },
    {
      $group: {
        _id: null,
        avg_households_worked: { $avg: '$total_households_worked' },
        avg_persondays_generated: { $avg: '$persondays_of_central_liability' },
        avg_wage_per_day: { $avg: '$average_wage_rate_per_day' },
        avg_expenditure: { $avg: '$total_exp' },
        avg_ongoing_works: { $avg: '$number_of_ongoing_works' },
        total_districts: { $sum: 1 }
      }
    }
  ]);
};

// Instance methods
performanceDataSchema.methods.getPerformanceStatus = function(averageData) {
  const status = {};
  
  status.households_worked = this.total_households_worked > averageData.avg_households_worked ? 'above' : 'below';
  status.persondays_generated = this.persondays_of_central_liability > averageData.avg_persondays_generated ? 'above' : 'below';
  status.avg_wage = this.average_wage_rate_per_day > averageData.avg_wage_per_day ? 'above' : 'below';
  status.expenditure = this.total_exp > averageData.avg_expenditure ? 'above' : 'below';
  
  return status;
};

const PerformanceData = mongoose.model('PerformanceData', performanceDataSchema);

module.exports = PerformanceData;