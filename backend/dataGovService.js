const axios = require('axios');

class DataGovINService {
  constructor() {
    this.baseURL = 'https://api.data.gov.in/resource';
    this.apiKey = '579b464db66ec23bdd00000124668135dcf749ed4117b59bd0b56b9c';
    this.resourceId = '8ae38a29-4f3a-42eb-a1be-e0d79bb981ab'; // MGNREGA performance data resource ID
    this.cache = new Map(); // Simple in-memory cache
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  // Generate cache key
  getCacheKey(params) {
    return JSON.stringify(params);
  }

  // Check if cached data is valid
  isCacheValid(cacheEntry) {
    return cacheEntry && (Date.now() - cacheEntry.timestamp < this.cacheTimeout);
  }

  // Build API URL with parameters
  buildAPIUrl(filters = {}, options = {}) {
    const params = new URLSearchParams({
      'api-key': this.apiKey,
      format: options.format || 'json',
      offset: options.offset || 0,
      limit: options.limit || 100
    });

    // Add filters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(`filters[${key}]`, filters[key]);
      }
    });

    return `${this.baseURL}/${this.resourceId}?${params.toString()}`;
  }

  // Fetch data from API with caching
  async fetchData(filters = {}, options = {}) {
    const cacheKey = this.getCacheKey({ filters, options });
    const cachedData = this.cache.get(cacheKey);

    // Return cached data if valid
    if (this.isCacheValid(cachedData)) {
      console.log('📋 Returning cached data for:', filters);
      return cachedData.data;
    }

    try {
      const url = this.buildAPIUrl(filters, options);
      console.log('🌐 Fetching from API:', url);
      
      const response = await axios.get(url, {
        timeout: 30000, // 30 second timeout
        headers: {
          'User-Agent': 'BharatDigital-MGNREGA-Dashboard'
        }
      });

      const data = response.data;
      
      // Cache the response
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });

      console.log(`✅ Fetched ${data.records?.length || 0} records from API`);
      return data;

    } catch (error) {
      console.error('❌ API fetch failed:', error.message);
      
      // Return cached data if available, even if expired
      if (cachedData) {
        console.log('⚠️ Using expired cache due to API error');
        return cachedData.data;
      }
      
      throw new Error(`Failed to fetch data from data.gov.in: ${error.message}`);
    }
  }

  // Get all states
  async getAllStates() {
    try {
      const data = await this.fetchData({}, { limit: 1000 });
      const states = new Set();
      
      if (data.records) {
        data.records.forEach(record => {
          if (record.state_name) {
            states.add(record.state_name);
          }
        });
      }
      
      return Array.from(states).sort().map(state => ({ 
        state: state,
        state_code: this.getStateCode(state) 
      }));
    } catch (error) {
      console.error('Error fetching states:', error.message);
      return this.getFallbackStates();
    }
  }

  // Get districts by state
  async getDistrictsByState(stateName) {
    try {
      const data = await this.fetchData({ 
        state_name: stateName.toUpperCase() 
      }, { limit: 1000 });
      
      const districts = new Set();
      
      if (data.records) {
        data.records.forEach(record => {
          if (record.district_name) {
            districts.add(record.district_name);
          }
        });
      }
      
      return Array.from(districts).sort().map(district => ({ name: district }));
    } catch (error) {
      console.error('Error fetching districts:', error.message);
      return [];
    }
  }

  // Get performance data for district
  async getDistrictPerformance(state, district, options = {}) {
    try {
      const filters = {
        state_name: state.toUpperCase(),
        district_name: district.toUpperCase()
      };

      if (options.finYear) {
        filters.fin_year = options.finYear;
      }

      const data = await this.fetchData(filters, { 
        limit: options.limit || 50,
        offset: options.offset || 0 
      });
      
      return this.formatPerformanceData(data.records || []);
    } catch (error) {
      console.error('Error fetching district performance:', error.message);
      return [];
    }
  }

  // Search districts across states
  async searchDistricts(searchTerm) {
    try {
      const data = await this.fetchData({}, { limit: 1000 });
      const results = [];
      
      if (data.records) {
        const searchLower = searchTerm.toLowerCase();
        const uniqueDistricts = new Set();
        
        data.records.forEach(record => {
          if (record.district_name && 
              record.district_name.toLowerCase().includes(searchLower) &&
              !uniqueDistricts.has(`${record.state_name}-${record.district_name}`)) {
            
            uniqueDistricts.add(`${record.state_name}-${record.district_name}`);
            results.push({
              state: record.state_name,
              district: record.district_name
            });
          }
        });
      }
      
      return results.slice(0, 20); // Limit to 20 results
    } catch (error) {
      console.error('Error searching districts:', error.message);
      return [];
    }
  }

  // Get state average data
  async getStateAverage(state, year, month) {
    try {
      const filters = { state_name: state.toUpperCase() };
      if (year) filters.fin_year = year;
      
      const data = await this.fetchData(filters, { limit: 1000 });
      
      if (!data.records || data.records.length === 0) {
        return null;
      }

      // Calculate averages
      const records = data.records;
      const totals = records.reduce((acc, record) => {
        acc.households += parseInt(record.total_households_worked) || 0;
        acc.persondays += parseInt(record.persondays_of_central_liability_so_far) || 0;
        acc.wage += parseFloat(record.average_wage_rate_per_day_per_person) || 0;
        acc.expenditure += parseFloat(record.total_exp) || 0;
        acc.ongoingWorks += parseInt(record.number_of_ongoing_works) || 0;
        acc.count += 1;
        return acc;
      }, { households: 0, persondays: 0, wage: 0, expenditure: 0, ongoingWorks: 0, count: 0 });

      return {
        avg_households_worked: Math.round(totals.households / totals.count),
        avg_persondays_generated: Math.round(totals.persondays / totals.count),
        avg_wage_per_day: Math.round((totals.wage / totals.count) * 100) / 100,
        avg_expenditure: Math.round(totals.expenditure / totals.count),
        avg_ongoing_works: Math.round(totals.ongoingWorks / totals.count),
        total_districts: totals.count
      };
    } catch (error) {
      console.error('Error calculating state average:', error.message);
      return null;
    }
  }

  // Get performance data with filters
  async getPerformanceData(filters = {}) {
    try {
      const apiFilters = {};
      
      // Map our filter names to API field names
      if (filters.state_name) apiFilters.state_name = filters.state_name.toUpperCase();
      if (filters.district_name) apiFilters.district_name = filters.district_name.toUpperCase();
      if (filters.financial_year) apiFilters.fin_year = filters.financial_year;
      
      const options = {
        limit: filters.limit || 50,
        offset: filters.offset || 0
      };
      
      const data = await this.fetchData(apiFilters, options);
      
      return {
        records: this.formatPerformanceData(data.records || []),
        total: data.total || (data.records ? data.records.length : 0)
      };
    } catch (error) {
      console.error('Error fetching performance data:', error.message);
      
      // Return mock data as fallback
      const mockData = this.getMockPerformanceData(filters);
      return { records: mockData, total: mockData.length };
    }
  }

  // Generate mock performance data as fallback
  getMockPerformanceData(filters = {}) {
    const mockRecords = [
      {
        state_name: filters.state_name || 'ANDHRA PRADESH',
        district_name: filters.district_name || 'ANANTAPUR',
        fin_year: filters.financial_year || '2023-24',
        month: 'March',
        total_households_worked: '15000',
        persondays_of_central_liability: '180000',
        average_wage_rate_per_day: '280.50',
        total_exp: '5040000',
        women_persondays: '90000',
        sc_persondays: '45000',
        st_persondays: '18000'
      },
      {
        state_name: filters.state_name || 'ANDHRA PRADESH',
        district_name: filters.district_name || 'CHITTOOR',
        fin_year: filters.financial_year || '2023-24',
        month: 'February',
        total_households_worked: '12500',
        persondays_of_central_liability: '150000',
        average_wage_rate_per_day: '275.00',
        total_exp: '4125000',
        women_persondays: '75000',
        sc_persondays: '37500',
        st_persondays: '15000'
      }
    ];

    return mockRecords.filter(record => {
      if (filters.state_name && record.state_name !== filters.state_name.toUpperCase()) return false;
      if (filters.district_name && record.district_name !== filters.district_name.toUpperCase()) return false;
      if (filters.financial_year && record.fin_year !== filters.financial_year) return false;
      return true;
    });
  }

  // Format API data to match our schema
  formatPerformanceData(records) {
    return records.map(record => ({
      fin_year: record.fin_year || '',
      month: record.month || '',
      state_code: record.state_code || '',
      state_name: record.state_name || '',
      district_code: record.district_code || '',
      district_name: record.district_name || '',
      approved_labour_budget: parseFloat(record.approved_labour_budget) || 0,
      average_wage_rate_per_day: parseFloat(record.average_wage_rate_per_day_per_person) || 0,
      average_days_of_employment: parseFloat(record.average_days_of_employment_provided_per_household) || 0,
      differently_abled_persons_worked: parseInt(record.differently_abled_persons_worked) || 0,
      material_and_skilled_wages: parseFloat(record.material_and_skilled_wages) || 0,
      number_of_completed_works: parseInt(record.number_of_completed_works) || 0,
      number_of_gps_with_nil_exp: parseInt(record.number_of_gps_with_nil_exp) || 0,
      number_of_ongoing_works: parseInt(record.number_of_ongoing_works) || 0,
      persondays_of_central_liability: parseInt(record.persondays_of_central_liability_so_far) || 0,
      sc_persondays: parseInt(record.sc_persondays) || 0,
      sc_workers_against_active_workers: parseInt(record.sc_workers_against_active_workers) || 0,
      st_persondays: parseInt(record.st_persondays) || 0,
      st_workers_against_active_workers: parseInt(record.st_workers_against_active_workers) || 0,
      total_adm_expenditure: parseFloat(record.total_adm_expenditure) || 0,
      total_exp: parseFloat(record.total_exp) || 0,
      total_households_worked: parseInt(record.total_households_worked) || 0,
      total_individuals_worked: parseInt(record.total_individuals_worked) || 0,
      total_active_job_cards: parseInt(record.total_no_of_active_job_cards) || 0,
      total_active_workers: parseInt(record.total_no_of_active_workers) || 0,
      total_hhs_completed_100_days: parseInt(record.total_no_of_hhs_completed_100_days_of_wage_employment) || 0,
      total_job_cards_issued: parseInt(record.total_no_of_jobcards_issued) || 0,
      total_workers: parseInt(record.total_no_of_workers) || 0,
      total_works_takenup: parseInt(record.total_no_of_works_takenup) || 0,
      wages: parseFloat(record.wages) || 0,
      women_persondays: parseInt(record.women_persondays) || 0,
      percent_category_b_works: parseFloat(record.percent_of_category_b_works) || 0,
      percent_expenditure_agriculture: parseFloat(record.percent_of_expenditure_on_agriculture_allied_works) || 0,
      percent_nrm_expenditure: parseFloat(record.percent_of_nrm_expenditure) || 0,
      percentage_payments_within_15_days: parseFloat(record.percentage_payments_gererated_within_15_days) || 0,
      remarks: record.remarks || ''
    }));
  }

  // Get state code (simple mapping)
  getStateCode(stateName) {
    const stateCodeMap = {
      'ANDHRA PRADESH': 'AP',
      'ARUNACHAL PRADESH': 'AR',
      'ASSAM': 'AS',
      'BIHAR': 'BR',
      'CHHATTISGARH': 'CG',
      'GOA': 'GA',
      'GUJARAT': 'GJ',
      'HARYANA': 'HR',
      'HIMACHAL PRADESH': 'HP',
      'JHARKHAND': 'JH',
      'KARNATAKA': 'KA',
      'KERALA': 'KL',
      'MADHYA PRADESH': 'MP',
      'MAHARASHTRA': 'MH',
      'MANIPUR': 'MN',
      'MEGHALAYA': 'ML',
      'MIZORAM': 'MZ',
      'NAGALAND': 'NL',
      'ODISHA': 'OR',
      'PUNJAB': 'PB',
      'RAJASTHAN': 'RJ',
      'SIKKIM': 'SK',
      'TAMIL NADU': 'TN',
      'TELANGANA': 'TG',
      'TRIPURA': 'TR',
      'UTTAR PRADESH': 'UP',
      'UTTARAKHAND': 'UK',
      'WEST BENGAL': 'WB'
    };
    
    return stateCodeMap[stateName.toUpperCase()] || stateName.substring(0, 2).toUpperCase();
  }

  // Fallback states if API fails
  getFallbackStates() {
    return [
      { state: 'UTTAR PRADESH', state_code: 'UP' },
      { state: 'MADHYA PRADESH', state_code: 'MP' },
      { state: 'BIHAR', state_code: 'BR' },
      { state: 'ASSAM', state_code: 'AS' },
      { state: 'MAHARASHTRA', state_code: 'MH' },
      { state: 'GUJARAT', state_code: 'GJ' },
      { state: 'RAJASTHAN', state_code: 'RJ' },
      { state: 'TAMIL NADU', state_code: 'TN' },
      { state: 'CHHATTISGARH', state_code: 'CG' },
      { state: 'KARNATAKA', state_code: 'KA' }
    ];
  }

  // Clear cache (useful for testing)
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

module.exports = { DataGovINService };