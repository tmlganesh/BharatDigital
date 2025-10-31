#!/usr/bin/env node

/**
 * Database Health Check Script
 * Verifies database connection and data integrity
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { StateDistrict, PerformanceData } = require('./models');

class DatabaseHealthCheck {
  constructor() {
    this.results = {
      connection: false,
      states: 0,
      districts: 0,
      performanceRecords: 0,
      sampleQueries: [],
      errors: []
    };
  }

  async connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      this.results.connection = true;
      console.log('✅ Database connection successful');
    } catch (error) {
      this.results.errors.push(`Connection failed: ${error.message}`);
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async checkDataCounts() {
    try {
      // Count states
      this.results.states = await StateDistrict.countDocuments();
      console.log(`📊 States: ${this.results.states}`);

      // Count districts
      const districtCount = await StateDistrict.aggregate([
        { $unwind: '$districts' },
        { $count: 'total' }
      ]);
      this.results.districts = districtCount[0]?.total || 0;
      console.log(`📍 Districts: ${this.results.districts}`);

      // Count performance records
      this.results.performanceRecords = await PerformanceData.countDocuments();
      console.log(`📈 Performance Records: ${this.results.performanceRecords}`);

    } catch (error) {
      this.results.errors.push(`Data count error: ${error.message}`);
      console.error('❌ Error checking data counts:', error.message);
    }
  }

  async testSampleQueries() {
    try {
      console.log('\n🔍 Testing sample queries...');

      // Test 1: Get all states
      const states = await StateDistrict.find({}, { state: 1, _id: 0 }).limit(5);
      this.results.sampleQueries.push({
        query: 'Get all states (limit 5)',
        success: states.length > 0,
        count: states.length,
        sample: states.map(s => s.state)
      });
      console.log(`  ✅ States query: ${states.length} results`);

      // Test 2: Get districts for a state
      if (states.length > 0) {
        const firstState = states[0].state;
        const stateData = await StateDistrict.findOne({ state: firstState });
        if (stateData) {
          this.results.sampleQueries.push({
            query: `Get districts for ${firstState}`,
            success: stateData.districts.length > 0,
            count: stateData.districts.length,
            sample: stateData.districts.slice(0, 3).map(d => d.name)
          });
          console.log(`  ✅ Districts query: ${stateData.districts.length} results for ${firstState}`);
        }
      }

      // Test 3: Get performance data
      const performanceData = await PerformanceData.find({})
        .sort({ fin_year: -1, month: -1 })
        .limit(5)
        .select('state_name district_name fin_year month total_households_worked');

      this.results.sampleQueries.push({
        query: 'Get recent performance data (limit 5)',
        success: performanceData.length > 0,
        count: performanceData.length,
        sample: performanceData.map(p => `${p.district_name}, ${p.state_name} (${p.month} ${p.fin_year})`)
      });
      console.log(`  ✅ Performance query: ${performanceData.length} results`);

      // Test 4: Aggregation query
      const stateAverage = await PerformanceData.aggregate([
        { $match: { fin_year: '2024-25', month: 'August' } },
        {
          $group: {
            _id: '$state_name',
            avg_households: { $avg: '$total_households_worked' },
            total_records: { $sum: 1 }
          }
        },
        { $sort: { avg_households: -1 } },
        { $limit: 3 }
      ]);

      this.results.sampleQueries.push({
        query: 'Aggregation: State averages for Aug 2024-25',
        success: stateAverage.length > 0,
        count: stateAverage.length,
        sample: stateAverage.map(s => `${s._id}: ${Math.round(s.avg_households)} avg households`)
      });
      console.log(`  ✅ Aggregation query: ${stateAverage.length} results`);

    } catch (error) {
      this.results.errors.push(`Sample query error: ${error.message}`);
      console.error('❌ Error in sample queries:', error.message);
    }
  }

  async checkDataIntegrity() {
    try {
      console.log('\n🔍 Checking data integrity...');

      // Check for missing required fields
      const invalidStates = await StateDistrict.find({ 
        $or: [
          { state: { $exists: false } },
          { state: '' },
          { districts: { $exists: false } },
          { districts: { $size: 0 } }
        ]
      });

      if (invalidStates.length > 0) {
        this.results.errors.push(`Found ${invalidStates.length} states with missing data`);
        console.warn(`⚠️  Found ${invalidStates.length} states with missing required fields`);
      } else {
        console.log('  ✅ All states have required fields');
      }

      // Check for performance data without required fields
      const invalidPerformance = await PerformanceData.countDocuments({
        $or: [
          { state_name: { $exists: false } },
          { district_name: { $exists: false } },
          { fin_year: { $exists: false } },
          { month: { $exists: false } }
        ]
      });

      if (invalidPerformance > 0) {
        this.results.errors.push(`Found ${invalidPerformance} performance records with missing data`);
        console.warn(`⚠️  Found ${invalidPerformance} performance records with missing required fields`);
      } else {
        console.log('  ✅ All performance records have required fields');
      }

    } catch (error) {
      this.results.errors.push(`Data integrity check error: ${error.message}`);
      console.error('❌ Error checking data integrity:', error.message);
    }
  }

  generateReport() {
    console.log('\n📋 DATABASE HEALTH REPORT');
    console.log('=========================');
    
    console.log('\n🔌 Connection Status:');
    console.log(`   Database: ${this.results.connection ? '✅ Connected' : '❌ Failed'}`);
    
    console.log('\n📊 Data Summary:');
    console.log(`   States: ${this.results.states}`);
    console.log(`   Districts: ${this.results.districts}`);
    console.log(`   Performance Records: ${this.results.performanceRecords}`);
    
    console.log('\n🔍 Sample Queries:');
    this.results.sampleQueries.forEach(query => {
      console.log(`   ${query.success ? '✅' : '❌'} ${query.query}: ${query.count} results`);
      if (query.sample && query.sample.length > 0) {
        query.sample.forEach(sample => {
          console.log(`      - ${sample}`);
        });
      }
    });

    if (this.results.errors.length > 0) {
      console.log('\n⚠️  Errors Found:');
      this.results.errors.forEach(error => {
        console.log(`   ❌ ${error}`);
      });
    } else {
      console.log('\n✅ No errors found - Database is healthy!');
    }

    console.log('\n💡 Recommendations:');
    if (this.results.states === 0) {
      console.log('   - Run: npm run seed:sample (for testing) or npm run seed (for full data)');
    }
    if (this.results.performanceRecords === 0) {
      console.log('   - Run: npm run seed:performance');
    }
    if (this.results.errors.length > 0) {
      console.log('   - Check MongoDB connection and permissions');
      console.log('   - Verify environment variables (MONGO_URI)');
      console.log('   - Re-run database seeding if data is missing');
    }
    if (this.results.states > 0 && this.results.performanceRecords > 0 && this.results.errors.length === 0) {
      console.log('   - Database is ready for production use! 🚀');
    }
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      console.log('\n👋 Disconnected from database');
    } catch (error) {
      console.error('Error disconnecting:', error.message);
    }
  }
}

async function main() {
  console.log('🔍 MGNREGA Database Health Check');
  console.log('================================\n');

  const healthCheck = new DatabaseHealthCheck();

  try {
    await healthCheck.connect();
    await healthCheck.checkDataCounts();
    await healthCheck.testSampleQueries();
    await healthCheck.checkDataIntegrity();
    healthCheck.generateReport();
  } catch (error) {
    console.error('\n❌ Health check failed:', error.message);
    process.exit(1);
  } finally {
    await healthCheck.disconnect();
  }
}

main();