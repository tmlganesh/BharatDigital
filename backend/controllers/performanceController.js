const { PerformanceData } = require('../models');
const { MockDataService } = require('../mockDataService');
const Joi = require('joi');

class PerformanceController {
  // Get district performance data
  async getDistrictPerformance(req, res) {
    try {
      const { state, district } = req.params;
      const { year, month, limit = 12 } = req.query;

      // Validation
      const schema = Joi.object({
        state: Joi.string().required(),
        district: Joi.string().required(),
        year: Joi.number().integer().min(2005).max(2030),
        month: Joi.string().valid(
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ),
        limit: Joi.number().integer().min(1).max(50)
      });

      const { error } = schema.validate({ state, district, year: year ? parseInt(year) : undefined, month, limit: parseInt(limit) });
      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.details[0].message
        });
      }

      // Build query
      const query = { state_name: state, district_name: district };
      if (year) query.fin_year = year;
      if (month) query.month = month;

      // Fetch performance data
      let performanceData;
      let stateAverage;
      let nationalAverage;

      try {
        performanceData = await PerformanceData.find(query)
          .sort({ fin_year: -1, month: -1 })
          .limit(parseInt(limit));

        if (!performanceData || performanceData.length === 0) {
          console.warn(`No performance data found in DB for ${district}, ${state}, using mock data`);
          performanceData = MockDataService.getDistrictPerformance(state, district);
        }

        // Get latest month data for comparison
        const latestData = performanceData[0];
        
        // Get state average for comparison
        stateAverage = await PerformanceData.getStateAverage(
          state, 
          latestData.fin_year, 
          latestData.month
        );

        // Get national average for comparison
        nationalAverage = await PerformanceData.getNationalAverage(
          latestData.fin_year, 
          latestData.month
        );
      } catch (dbError) {
        console.warn('Database unavailable for performance data, using mock data:', dbError.message);
        performanceData = MockDataService.getDistrictPerformance(state, district);
        const latestData = performanceData[0];
        stateAverage = MockDataService.getStateAverage(state, latestData.fin_year, latestData.month);
        nationalAverage = MockDataService.getNationalAverage(latestData.fin_year, latestData.month);
      }

      if (!performanceData || performanceData.length === 0) {
        return res.status(404).json({
          error: 'No Data Found',
          message: `No performance data found for ${district}, ${state}`
        });
      }

      const latestData = performanceData[0];

      // Calculate performance status manually since mock data doesn't have the method
      let performanceStatus = null;
      if (stateAverage && stateAverage.length > 0) {
        const stateAvg = stateAverage[0];
        const latestHouseholds = latestData.total_households_worked || 0;
        const avgHouseholds = stateAvg.avg_households_worked || stateAvg.total_households_worked || 0;
        
        if (latestHouseholds > avgHouseholds * 1.1) {
          performanceStatus = 'Above Average';
        } else if (latestHouseholds < avgHouseholds * 0.9) {
          performanceStatus = 'Below Average';
        } else {
          performanceStatus = 'Average';
        }
      }

      res.status(200).json({
        success: true,
        data: {
          district: district,
          state: state,
          latest: latestData,
          historical: performanceData,
          comparison: {
            state_average: stateAverage && stateAverage.length > 0 ? stateAverage[0] : null,
            national_average: nationalAverage && nationalAverage.length > 0 ? nationalAverage[0] : null,
            performance_status: performanceStatus
          }
        }
      });

    } catch (error) {
      console.error('Error fetching district performance:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch district performance data'
      });
    }
  }

  // Compare two districts
  async compareDistricts(req, res) {
    try {
      const { districts } = req.body;
      const { year, month } = req.query;

      // Validation
      const schema = Joi.object({
        districts: Joi.array().items(
          Joi.object({
            state: Joi.string().required(),
            district: Joi.string().required()
          })
        ).min(2).max(4).required(),
        year: Joi.number().integer().min(2005).max(2030),
        month: Joi.string().valid(
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        )
      });

      const { error } = schema.validate({ 
        districts, 
        year: year ? parseInt(year) : undefined, 
        month 
      });

      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.details[0].message
        });
      }

      const comparisons = [];

      for (const districtInfo of districts) {
        const query = { 
          state_name: districtInfo.state, 
          district_name: districtInfo.district 
        };
        
        if (year) query.fin_year = year;
        if (month) query.month = month;

        const data = await PerformanceData.findOne(query).sort({ fin_year: -1, month: -1 });
        
        if (data) {
          comparisons.push({
            state: districtInfo.state,
            district: districtInfo.district,
            data: data
          });
        }
      }

      if (comparisons.length < 2) {
        return res.status(404).json({
          error: 'Insufficient Data',
          message: 'Not enough data available for comparison'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          comparison: comparisons,
          metrics: {
            highest_households_worked: comparisons.reduce((prev, current) => 
              (prev.data.total_households_worked > current.data.total_households_worked) ? prev : current
            ),
            highest_persondays: comparisons.reduce((prev, current) => 
              (prev.data.persondays_of_central_liability > current.data.persondays_of_central_liability) ? prev : current
            ),
            highest_wage: comparisons.reduce((prev, current) => 
              (prev.data.average_wage_rate_per_day > current.data.average_wage_rate_per_day) ? prev : current
            )
          }
        }
      });

    } catch (error) {
      console.error('Error comparing districts:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to compare districts'
      });
    }
  }

  // Get trending data
  async getTrendingData(req, res) {
    try {
      const { year = new Date().getFullYear() } = req.query;

      const trendingData = await PerformanceData.aggregate([
        { $match: { fin_year: year.toString() } },
        {
          $group: {
            _id: '$month',
            total_households: { $sum: '$total_households_worked' },
            total_persondays: { $sum: '$persondays_of_central_liability' },
            avg_wage: { $avg: '$average_wage_rate_per_day' },
            total_expenditure: { $sum: '$total_exp' },
            districts_count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          year: parseInt(year),
          monthly_trends: trendingData
        }
      });

    } catch (error) {
      console.error('Error fetching trending data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch trending data'
      });
    }
  }

  // Get top performing districts
  async getTopPerformers(req, res) {
    try {
      const { state, metric = 'total_households_worked', limit = 10 } = req.query;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

      const matchQuery = { fin_year: currentYear.toString(), month: currentMonth };
      if (state) matchQuery.state_name = state;

      const topPerformers = await PerformanceData.find(matchQuery)
        .sort({ [metric]: -1 })
        .limit(parseInt(limit))
        .select('state_name district_name total_households_worked persondays_of_central_liability average_wage_rate_per_day total_exp');

      res.status(200).json({
        success: true,
        data: {
          metric: metric,
          period: `${currentMonth} ${currentYear}`,
          top_performers: topPerformers
        }
      });

    } catch (error) {
      console.error('Error fetching top performers:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch top performers'
      });
    }
  }
}

module.exports = new PerformanceController();