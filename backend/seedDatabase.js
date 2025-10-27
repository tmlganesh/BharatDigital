const mongoose = require('mongoose');
const { PerformanceData, StateDistrict } = require('./models');
require('dotenv').config({ path: '../.env' });

// Sample states and districts data
const statesDistrictsData = [
  {
    state: "Madhya Pradesh",
    state_code: "MP",
    districts: [
      { name: "Bhopal", code: "BPL" },
      { name: "Indore", code: "IDR" },
      { name: "Gwalior", code: "GWL" },
      { name: "Jabalpur", code: "JBP" },
      { name: "Ujjain", code: "UJN" },
      { name: "Sagar", code: "SGR" },
      { name: "Dewas", code: "DWS" },
      { name: "Satna", code: "STN" },
      { name: "Ratlam", code: "RTM" },
      { name: "Rewa", code: "RWA" }
    ]
  },
  {
    state: "Uttar Pradesh",
    state_code: "UP",
    districts: [
      { name: "Lucknow", code: "LKO" },
      { name: "Kanpur", code: "KNP" },
      { name: "Agra", code: "AGR" },
      { name: "Varanasi", code: "VNS" },
      { name: "Meerut", code: "MRT" },
      { name: "Allahabad", code: "ALD" },
      { name: "Bareilly", code: "BRL" },
      { name: "Aligarh", code: "ALG" },
      { name: "Moradabad", code: "MRD" },
      { name: "Saharanpur", code: "SHP" }
    ]
  },
  {
    state: "Rajasthan",
    state_code: "RJ",
    districts: [
      { name: "Jaipur", code: "JPR" },
      { name: "Jodhpur", code: "JDP" },
      { name: "Kota", code: "KTA" },
      { name: "Bikaner", code: "BKN" },
      { name: "Ajmer", code: "AJM" },
      { name: "Udaipur", code: "UDP" },
      { name: "Bhilwara", code: "BHW" },
      { name: "Alwar", code: "ALW" },
      { name: "Bharatpur", code: "BTP" },
      { name: "Pali", code: "PLI" }
    ]
  },
  {
    state: "Bihar",
    state_code: "BR",
    districts: [
      { name: "Patna", code: "PTN" },
      { name: "Gaya", code: "GYA" },
      { name: "Bhagalpur", code: "BGP" },
      { name: "Muzaffarpur", code: "MZP" },
      { name: "Purnia", code: "PRN" },
      { name: "Darbhanga", code: "DBG" },
      { name: "Bihar Sharif", code: "BSF" },
      { name: "Arrah", code: "ARH" },
      { name: "Begusarai", code: "BGS" },
      { name: "Katihar", code: "KTH" }
    ]
  },
  {
    state: "West Bengal",
    state_code: "WB",
    districts: [
      { name: "Kolkata", code: "KOL" },
      { name: "Howrah", code: "HWH" },
      { name: "Durgapur", code: "DGP" },
      { name: "Asansol", code: "ASN" },
      { name: "Siliguri", code: "SLG" },
      { name: "Malda", code: "MLD" },
      { name: "Barasat", code: "BRS" },
      { name: "Bardhaman", code: "BDN" },
      { name: "Jalpaiguri", code: "JPG" },
      { name: "Cooch Behar", code: "CBH" }
    ]
  }
];

// Function to generate random performance data
function generatePerformanceData(state, district, year, month) {
  const baseHouseholds = Math.floor(Math.random() * 10000) + 1000;
  const basePersondays = baseHouseholds * (Math.floor(Math.random() * 50) + 10);
  const baseWage = Math.floor(Math.random() * 100) + 200;
  
  return {
    state,
    district,
    year,
    month,
    total_households_worked: baseHouseholds,
    persondays_generated: basePersondays,
    avg_wage_per_day: baseWage,
    total_expenditure: basePersondays * baseWage,
    ongoing_works: Math.floor(Math.random() * 100) + 20,
    completed_works: Math.floor(Math.random() * 150) + 50,
    total_works: 0, // Will be calculated by pre-save middleware
    women_participation_percentage: Math.floor(Math.random() * 40) + 30,
    sc_st_participation_percentage: Math.floor(Math.random() * 30) + 15
  };
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await PerformanceData.deleteMany({});
    await StateDistrict.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Insert states and districts
    await StateDistrict.insertMany(statesDistrictsData);
    console.log('✅ Inserted states and districts data');

    // Generate performance data for the last 12 months
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentYear = 2024;
    const performanceData = [];

    statesDistrictsData.forEach(stateInfo => {
      stateInfo.districts.forEach(district => {
        // Generate data for current year (2024)
        months.forEach(month => {
          performanceData.push(
            generatePerformanceData(stateInfo.state, district.name, currentYear, month)
          );
        });

        // Generate data for previous year (2023) - last 6 months
        ['July', 'August', 'September', 'October', 'November', 'December'].forEach(month => {
          performanceData.push(
            generatePerformanceData(stateInfo.state, district.name, currentYear - 1, month)
          );
        });
      });
    });

    // Insert performance data in batches
    const batchSize = 100;
    for (let i = 0; i < performanceData.length; i += batchSize) {
      const batch = performanceData.slice(i, i + batchSize);
      await PerformanceData.insertMany(batch);
      console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(performanceData.length/batchSize)}`);
    }

    console.log(`✅ Successfully seeded database with:`);
    console.log(`   - ${statesDistrictsData.length} states`);
    console.log(`   - ${statesDistrictsData.reduce((sum, state) => sum + state.districts.length, 0)} districts`);
    console.log(`   - ${performanceData.length} performance records`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;