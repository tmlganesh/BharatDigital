const { DataGovINService } = require('../dataGovService');
const Joi = require('joi');

const dataGovService = new DataGovINService();

class StateController {
  // Get all states
  async getAllStates(req, res) {
    try {
      console.log('📋 Fetching states from data.gov.in API...');
      const states = await dataGovService.getAllStates();

      if (!states || states.length === 0) {
        return res.status(404).json({
          error: 'No Data Found',
          message: 'No states found from data.gov.in API.'
        });
      }

      res.status(200).json({ 
        success: true, 
        data: { 
          states, 
          count: states.length,
          source: 'data.gov.in API'
        } 
      });

    } catch (error) {
      console.error('Error fetching states:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch states data from data.gov.in API.'
      });
    }
  }

  // Get districts by state
  async getDistrictsByState(req, res) {
    try {
      const { state } = req.params;

      // Validation
      const schema = Joi.object({
        state: Joi.string().required().min(1).max(100)
      });

      const { error } = schema.validate({ state });
      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.details[0].message
        });
      }

      console.log(`📍 Fetching districts for ${state} from data.gov.in API...`);
      const districts = await dataGovService.getDistrictsByState(state);
      
      if (!districts || districts.length === 0) {
        return res.status(404).json({
          error: 'No Districts Found',
          message: `No districts found for state '${state}' in data.gov.in API`
        });
      }

      res.status(200).json({
        success: true,
        data: {
          state: state,
          districts: districts,
          count: districts.length,
          source: 'data.gov.in API'
        }
      });

    } catch (error) {
      console.error('Error fetching districts:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch districts data from data.gov.in API'
      });
    }
  }

  // Search districts across all states
  async searchDistricts(req, res) {
    try {
      const { q } = req.query;

      // Validation
      const schema = Joi.object({
        q: Joi.string().required().min(2).max(50)
      });

      const { error } = schema.validate({ q });
      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.details[0].message
        });
      }

      console.log(`🔍 Searching districts with query: "${q}" using data.gov.in API...`);
      const searchResults = await dataGovService.searchDistricts(q);
      
      res.status(200).json({
        success: true,
        data: {
          query: q,
          results: searchResults,
          count: searchResults.length,
          source: 'data.gov.in API'
        }
      });

    } catch (error) {
      console.error('Error searching districts:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to search districts using data.gov.in API'
      });
    }
  }

  // Get state statistics
  async getStateStatistics(req, res) {
    try {
      const stats = await StateDistrict.aggregate([
        {
          $project: {
            state: 1,
            district_count: { $size: '$districts' }
          }
        },
        { $sort: { district_count: -1 } }
      ]);

      const totalDistricts = stats.reduce((sum, state) => sum + state.district_count, 0);

      res.status(200).json({
        success: true,
        data: {
          total_states: stats.length,
          total_districts: totalDistricts,
          state_wise_districts: stats
        }
      });

    } catch (error) {
      console.error('Error fetching state statistics:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch state statistics'
      });
    }
  }
}

module.exports = new StateController();