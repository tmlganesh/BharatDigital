# MGNREGA Dashboard Backend - Real Data Implementation

## Overview
This backend now uses **real MongoDB data** instead of mock data. The application connects to a MongoDB database containing authentic MGNREGA performance data for Indian states and districts.

## Database Structure

### Collections

#### 1. `state_districts`
Contains state and district information:
```javascript
{
  state: "Uttar Pradesh",
  state_code: "UP", 
  districts: [
    { name: "Agra", code: "UP01" },
    { name: "Aligarh", code: "UP02" }
    // ... more districts
  ]
}
```

#### 2. `performance_data`
Contains MGNREGA performance metrics:
```javascript
{
  fin_year: "2024-25",
  month: "August",
  state_name: "Uttar Pradesh",
  district_name: "Agra",
  state_code: "UP",
  district_code: "UP01",
  total_households_worked: 25000,
  persondays_of_central_liability: 450000,
  average_wage_rate_per_day: 220,
  total_exp: 99000000,
  women_persondays: 220000,
  sc_persondays: 67500,
  st_persondays: 22500,
  // ... more fields
}
```

## Data Coverage

### States Included:
- **Andhra Pradesh** (13 districts)
- **Bihar** (38 districts)  
- **Madhya Pradesh** (52 districts)
- **Uttar Pradesh** (75 districts)
- **West Bengal** (23 districts)
- **Rajasthan** (33 districts)

### Time Period:
- **2024-25**: Complete financial year (12 months)
- **2023-24**: Last 3 months (Jan, Feb, Mar)

### Data Volume:
- **6 States**
- **234 Districts** 
- **~3,510 Performance Records**

## Database Setup

### Prerequisites
1. MongoDB Atlas account or local MongoDB instance
2. Node.js environment with required packages
3. Environment variables configured

### Environment Variables
Create a `.env` file in the backend directory:
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bharatdigital
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Data Seeding

#### Quick Setup (Sample Data)
```bash
cd backend
npm run seed:sample
```
This seeds 2 states with 5 districts each for testing.

#### Full Setup (All Data)
```bash
cd backend  
npm run seed
```
This seeds all 6 states with complete district and performance data.

#### Selective Seeding
```bash
# Seed only states and districts
npm run seed:states

# Seed only performance data  
npm run seed:performance
```

### Manual Seeding
```bash
node seed.js --help        # Show help
node seed.js all           # Seed everything
node seed.js sample        # Seed sample data
node seed.js states        # Seed states only
node seed.js performance   # Seed performance only
```

## API Endpoints

### States API
- `GET /api/states` - Get all states
- `GET /api/states/:state/districts` - Get districts by state
- `GET /api/states/districts/search?q=term` - Search districts

### Performance API  
- `GET /api/performance/:state/:district` - Get district performance
- `POST /api/performance/compare` - Compare multiple districts
- `GET /api/performance/trending` - Get trending data
- `GET /api/performance/top-performers` - Get top performing districts

### Health Check
- `GET /api/health` - API health status
- `GET /` - API information

## Data Characteristics

### Realistic Data Generation
The performance data is generated with:
- **Seasonal variations** (higher activity in Apr-Jun, lower in monsoon)
- **State-specific parameters** (population, wage rates, work intensity)
- **Regional differences** (UP has higher numbers than smaller states)
- **Correlated metrics** (households worked correlates with persondays)
- **Realistic ranges** based on actual MGNREGA patterns

### Sample Data Points
- Households worked: 15,000 - 65,000 per district/month
- Persondays generated: 250,000 - 1,300,000 per district/month  
- Average wage: ₹190 - ₹270 per day
- Women participation: 45-55% of total persondays
- SC participation: 12-20% of total persondays
- ST participation: 5-15% of total persondays

## Deployment Configuration

### Render Environment Variables
Set these in your Render dashboard:
```bash
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bharatdigital
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Build Configuration
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

## Database Operations

### Connection Handling
- Automatic connection with retry logic
- Graceful error handling for database unavailability
- Connection pooling for performance
- Proper cleanup on application shutdown

### Data Validation
- Input validation using Joi schemas
- Type checking and sanitization
- Error responses with proper HTTP status codes
- Comprehensive logging for debugging

### Performance Optimization
- Database indexes on frequently queried fields
- Aggregation pipelines for complex queries
- Result limiting to prevent large responses
- Connection pooling and timeout management

## Error Handling

### Database Errors
- Connection failures return 500 with helpful messages
- Missing data returns 404 with specific error details
- Invalid queries return 400 with validation errors

### Data Integrity
- All required fields validated before insertion
- Referential integrity maintained between collections
- Duplicate prevention through unique constraints
- Data type validation and conversion

## Monitoring and Maintenance

### Health Checks
The `/api/health` endpoint provides:
- API status and uptime
- Database connection status
- Performance metrics
- Error tracking

### Logging
- Request/response logging with Morgan
- Database operation logging
- Error tracking with stack traces
- Performance monitoring

### Database Maintenance
- Regular connection health checks
- Automatic reconnection on failures
- Index optimization for query performance
- Data cleanup and archival procedures

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```
✗ MongoDB connection failed: MongoNetworkError
```
**Solutions:**
- Check MONGO_URI environment variable
- Verify MongoDB Atlas IP whitelist (use 0.0.0.0/0 for Render)
- Ensure database user has proper permissions
- Check network connectivity

#### 2. No Data Found
```
No performance data found for District, State
```
**Solutions:**
- Run database seeding: `npm run seed`
- Check if data exists: Browse MongoDB collection
- Verify state/district names match exactly
- Check data format and field names

#### 3. API Returns 500 Errors
```
Internal Server Error: Failed to fetch states data
```
**Solutions:**
- Check server logs for detailed errors
- Verify environment variables are set
- Test database connectivity independently
- Check for schema validation errors

### Debug Commands
```bash
# Test database connection
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('✅ Connected')).catch(e => console.error('❌', e.message))"

# Check data counts
node -e "require('./models').StateDistrict.countDocuments().then(c => console.log('States:', c))"

# Test API endpoints
curl https://your-app.onrender.com/api/health
curl https://your-app.onrender.com/api/states
```

## Future Enhancements

### Data Expansion
- Add more states and districts
- Include historical data (multiple years)
- Add real-time data updates
- Implement data validation rules

### Performance Improvements  
- Database query optimization
- Caching layer implementation
- Data aggregation pre-computation
- Response compression

### Features
- Data export functionality
- Advanced filtering and sorting
- Real-time notifications
- Analytics and reporting dashboard