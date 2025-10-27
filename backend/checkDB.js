const mongoose = require('mongoose');
const { PerformanceData, StateDistrict } = require('./models');
require('dotenv').config({ path: '../.env' });

async function checkDatabaseStatus() {
  try {
    console.log('🔍 Checking database connection and data...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check StateDistrict collection
    const stateCount = await StateDistrict.countDocuments();
    console.log(`📊 States in database: ${stateCount}`);
    
    if (stateCount > 0) {
      const sampleStates = await StateDistrict.find().limit(3);
      console.log('🏛️ Sample states:', sampleStates.map(s => ({ 
        state: s.state, 
        districts: s.districts.length 
      })));
    }
    
    // Check PerformanceData collection
    const performanceCount = await PerformanceData.countDocuments();
    console.log(`📈 Performance records in database: ${performanceCount}`);
    
    if (performanceCount > 0) {
      const samplePerformance = await PerformanceData.find().limit(2);
      console.log('📋 Sample performance data:', samplePerformance.map(p => ({
        state: p.state_name,
        district: p.district_name,
        year: p.fin_year,
        month: p.month
      })));
    }
    
    // Test the StateDistrict.getAllStates method
    console.log('\n🧪 Testing StateDistrict.getAllStates()...');
    const states = await StateDistrict.getAllStates();
    console.log(`📋 getAllStates returned: ${Array.isArray(states) ? states.length : 'not an array'} items`);
    
    if (Array.isArray(states) && states.length > 0) {
      console.log('✅ First few states:', states.slice(0, 3));
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database check failed:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

checkDatabaseStatus();
