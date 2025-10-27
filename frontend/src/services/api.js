import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

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
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message)
    
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
  getAll: () => api.get('/states'),
  
  // Get districts by state
  getDistricts: (state) => api.get(`/districts/${encodeURIComponent(state)}`),
  
  // Search districts
  searchDistricts: (query) => api.get(`/states/search?q=${encodeURIComponent(query)}`),
  
  // Get state statistics
  getStatistics: () => api.get('/states/statistics'),
}

export const performanceAPI = {
  // Get district performance
  getDistrictPerformance: (state, district, params = {}) => 
    api.get(`/performance/${encodeURIComponent(state)}/${encodeURIComponent(district)}`, { params }),
  
  // Compare districts
  compareDistricts: (districts, params = {}) => 
    api.post('/performance/compare', { districts }, { params }),
  
  // Get trending data
  getTrending: (params = {}) => 
    api.get('/performance/trends', { params }),
  
  // Get top performers
  getTopPerformers: (params = {}) => 
    api.get('/performance/top', { params }),
}

export const healthAPI = {
  // Health check
  check: () => api.get('/health'),
}

export default api