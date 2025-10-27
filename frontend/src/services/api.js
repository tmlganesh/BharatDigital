import axios from 'axios'
import { MockAPI } from './mockAPI.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// Check if we're in production and no backend URL is provided
const isProduction = import.meta.env.PROD
const shouldUseMockData = USE_MOCK_DATA || (isProduction && API_BASE_URL.includes('localhost'))

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  async (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message)
    
    // If backend is not available, fall back to mock data
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BLOCKED_BY_CLIENT' || error.message === 'Network Error') {
      console.warn('🔄 Backend unavailable, falling back to mock data')
      
      // Extract the endpoint from the failed request
      const url = error.config?.url || ''
      
      if (url.includes('/states') && !url.includes('/districts')) {
        return await MockAPI.getStates()
      }
      
      if (url.includes('/districts/')) {
        const state = decodeURIComponent(url.split('/districts/')[1])
        return await MockAPI.getDistricts(state)
      }
      
      if (url.includes('/performance/')) {
        const parts = url.split('/performance/')[1].split('/')
        const state = decodeURIComponent(parts[0])
        const district = decodeURIComponent(parts[1])
        const params = error.config?.params || {}
        return await MockAPI.getDistrictPerformance(state, district, params)
      }
      
      if (url.includes('/states/search')) {
        const query = new URLSearchParams(error.config?.url?.split('?')[1] || '').get('q') || ''
        return await MockAPI.searchDistricts(query)
      }
    }
    
    if (error.response?.status === 404) {
      throw new Error('Data not found for the selected location')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.')
    }
    
    throw error
  }
)

export const statesAPI = {
  // Get all states
  getAll: () => shouldUseMockData ? MockAPI.getStates() : api.get('/states'),
  
  // Get districts by state
  getDistricts: (state) => shouldUseMockData ? MockAPI.getDistricts(state) : api.get(`/districts/${encodeURIComponent(state)}`),
  
  // Search districts
  searchDistricts: (query) => shouldUseMockData ? MockAPI.searchDistricts(query) : api.get(`/states/search?q=${encodeURIComponent(query)}`),
  
  // Get state statistics
  getStatistics: () => shouldUseMockData ? MockAPI.getStates() : api.get('/states/statistics'),
}

export const performanceAPI = {
  // Get district performance
  getDistrictPerformance: (state, district, params = {}) => 
    shouldUseMockData ? MockAPI.getDistrictPerformance(state, district, params) : api.get(`/performance/${encodeURIComponent(state)}/${encodeURIComponent(district)}`, { params }),
  
  // Compare districts
  compareDistricts: (districts, params = {}) => 
    shouldUseMockData ? MockAPI.getDistrictPerformance(districts[0]?.state, districts[0]?.district, params) : api.post('/performance/compare', { districts }, { params }),
  
  // Get trending data
  getTrending: (params = {}) => 
    shouldUseMockData ? MockAPI.getStates() : api.get('/performance/trends', { params }),
  
  // Get top performers
  getTopPerformers: (params = {}) => 
    shouldUseMockData ? MockAPI.getStates() : api.get('/performance/top', { params }),
}

export const healthAPI = {
  // Health check
  check: () => api.get('/health'),
}

export default api