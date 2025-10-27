const { StateDistrict } = require('../models');
const { MockDataService } = require('../mockDataService');
const Joi = require('joi');

class StateController {
  // Get all states
  async getAllStates(req, res) {
    try {
      let states;
      
      // Try to get from database first
      try {
        states = await StateDistrict.getAllStates();
        
        // Defensive logging for unexpected return types
        if (!Array.isArray(states)) {
          console.error('getAllStates: unexpected result type', { type: typeof states, value: states });
          throw new Error('Unexpected data format from database');
        }

        // If no states in DB, use mock data
        if (!states || states.length === 0) {
          console.warn('getAllStates: no states found in database, using mock data');
          states = MockDataService.getAllStates();
        }
      } catch (dbError) {
        console.warn('Database unavailable, using mock data:', dbError.message);
        states = MockDataService.getAllStates();
      }

      res.status(200).json({ 
        success: true, 
        data: { 
          states, 
          count: states.length,
          source: states.length > 0 ? 'database' : 'mock'
        } 
      });

    } catch (error) {
      console.error('Error fetching states:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch states data'
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

      let stateData;
      
      try {
        stateData = await StateDistrict.getDistrictsByState(state);
        
        if (!stateData) {
          console.warn(`State '${state}' not found in database, using mock data`);
          stateData = MockDataService.getDistrictsByState(state);
        }
      } catch (dbError) {
        console.warn('Database unavailable, using mock data:', dbError.message);
        stateData = MockDataService.getDistrictsByState(state);
      }
      
      if (!stateData) {
        return res.status(404).json({
          error: 'State Not Found',
          message: `State '${state}' not found`
        });
      }

      res.status(200).json({
        success: true,
        data: {
          state: state,
          districts: stateData.districts,
          count: stateData.districts.length
        }
      });

    } catch (error) {
      console.error('Error fetching districts:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch districts data'
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

      let searchResults;
      
      try {
        searchResults = await StateDistrict.searchDistricts(q);
      } catch (dbError) {
        console.warn('Database unavailable for search, using mock data:', dbError.message);
        searchResults = MockDataService.searchDistricts(q);
      }
      
      res.status(200).json({
        success: true,
        data: {
          query: q,
          results: searchResults,
          count: searchResults.length
        }
      });

    } catch (error) {
      console.error('Error searching districts:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to search districts'
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