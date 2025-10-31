const { DataGovINService } = require('../dataGovService');
const Joi = require('joi');

const dataGovService = new DataGovINService();

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

      // Build filters for API
      const filters = {
        state_name: state,
        district_name: district,
        limit: parseInt(limit)
      };
      if (year) filters.financial_year = year;

      // Fetch performance data from API
      const apiResult = await dataGovService.getPerformanceData(filters);
      const performanceData = apiResult.records || [];

      if (!performanceData || performanceData.length === 0) {
        return res.status(404).json({
          error: 'No Data Found',
          message: `No performance data found for ${district}, ${state}. Please check the API connection.`
        });
      }

      // Get latest month data for comparison
      const latestData = performanceData[0];
      
      // Get state average for comparison (simplified)
      const stateFilters = { state_name: state, limit: 100 };
      const stateApiResult = await dataGovService.getPerformanceData(stateFilters);
      const stateData = stateApiResult.records || [];
      
      const stateAverage = stateData.length > 0 ? {
        avg_households_worked: stateData.reduce((sum, item) => sum + (parseInt(item.total_households_worked) || 0), 0) / stateData.length,
        avg_persondays: stateData.reduce((sum, item) => sum + (parseInt(item.persondays_of_central_liability) || 0), 0) / stateData.length
      } : null;

      // National average (simplified - using sample data)
      const nationalAverage = {
        avg_households_worked: 5000,
        avg_persondays: 50000
      };

      // Calculate performance status
      let performanceStatus = null;
      if (stateAverage) {
        const latestHouseholds = parseInt(latestData.total_households_worked) || 0;
        const avgHouseholds = stateAverage.avg_households_worked || 0;
        
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
            state_average: stateAverage,
            national_average: nationalAverage,
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
        const filters = { 
          state_name: districtInfo.state, 
          district_name: districtInfo.district,
          limit: 1
        };
        
        if (year) filters.financial_year = year;

        const apiResult = await dataGovService.getPerformanceData(filters);
        const data = apiResult.records && apiResult.records.length > 0 ? apiResult.records[0] : null;
        
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

      // Get trending data from API
      const filters = { 
        financial_year: year.toString(),
        limit: 1000 
      };
      
      const apiResult = await dataGovService.getPerformanceData(filters);
      const allData = apiResult.records || [];
      
      // Group data by month manually
      const monthlyData = {};
      allData.forEach(record => {
        const month = record.month || 'Unknown';
        if (!monthlyData[month]) {
          monthlyData[month] = {
            total_households: 0,
            total_persondays: 0,
            total_wage: 0,
            total_expenditure: 0,
            count: 0
          };
        }
        
        monthlyData[month].total_households += parseInt(record.total_households_worked) || 0;
        monthlyData[month].total_persondays += parseInt(record.persondays_of_central_liability) || 0;
        monthlyData[month].total_wage += parseFloat(record.average_wage_rate_per_day) || 0;
        monthlyData[month].total_expenditure += parseFloat(record.total_exp) || 0;
        monthlyData[month].count += 1;
      });
      
      // Convert to array format
      const trendingData = Object.entries(monthlyData).map(([month, data]) => ({
        _id: month,
        total_households: data.total_households,
        total_persondays: data.total_persondays,
        avg_wage: data.count > 0 ? data.total_wage / data.count : 0,
        total_expenditure: data.total_expenditure,
        districts_count: data.count
      }));

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

      const filters = { 
        financial_year: currentYear.toString(),
        limit: parseInt(limit) * 2 // Get more data to filter and sort
      };
      if (state) filters.state_name = state;

      const apiResult = await dataGovService.getPerformanceData(filters);
      let allData = apiResult.records || [];
      
      // Sort by the specified metric and take top performers
      allData.sort((a, b) => {
        const aVal = parseFloat(a[metric]) || 0;
        const bVal = parseFloat(b[metric]) || 0;
        return bVal - aVal;
      });
      
      const topPerformers = allData.slice(0, parseInt(limit)).map(record => ({
        state_name: record.state_name,
        district_name: record.district_name,
        total_households_worked: record.total_households_worked,
        persondays_of_central_liability: record.persondays_of_central_liability,
        average_wage_rate_per_day: record.average_wage_rate_per_day,
        total_exp: record.total_exp
      }));

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