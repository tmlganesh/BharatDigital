const mongoose = require('mongoose');
const { StateDistrict, PerformanceData } = require('./models');

// Real MGNREGA states and districts data
const realStatesDistrictsData = [
  {
    state: "Andhra Pradesh",
    state_code: "AP",
    districts: [
      { name: "Anantapur", code: "AP01" },
      { name: "Chittoor", code: "AP02" },
      { name: "East Godavari", code: "AP03" },
      { name: "Guntur", code: "AP04" },
      { name: "Krishna", code: "AP05" },
      { name: "Kurnool", code: "AP06" },
      { name: "Nellore", code: "AP07" },
      { name: "Prakasam", code: "AP08" },
      { name: "Srikakulam", code: "AP09" },
      { name: "Visakhapatnam", code: "AP10" },
      { name: "Vizianagaram", code: "AP11" },
      { name: "West Godavari", code: "AP12" },
      { name: "YSR Kadapa", code: "AP13" }
    ]
  },
  {
    state: "Bihar",
    state_code: "BR",
    districts: [
      { name: "Araria", code: "BR01" },
      { name: "Arwal", code: "BR02" },
      { name: "Aurangabad", code: "BR03" },
      { name: "Banka", code: "BR04" },
      { name: "Begusarai", code: "BR05" },
      { name: "Bhagalpur", code: "BR06" },
      { name: "Bhojpur", code: "BR07" },
      { name: "Buxar", code: "BR08" },
      { name: "Darbhanga", code: "BR09" },
      { name: "East Champaran", code: "BR10" },
      { name: "Gaya", code: "BR11" },
      { name: "Gopalganj", code: "BR12" },
      { name: "Jamui", code: "BR13" },
      { name: "Jehanabad", code: "BR14" },
      { name: "Kaimur", code: "BR15" },
      { name: "Katihar", code: "BR16" },
      { name: "Khagaria", code: "BR17" },
      { name: "Kishanganj", code: "BR18" },
      { name: "Lakhisarai", code: "BR19" },
      { name: "Madhepura", code: "BR20" },
      { name: "Madhubani", code: "BR21" },
      { name: "Munger", code: "BR22" },
      { name: "Muzaffarpur", code: "BR23" },
      { name: "Nalanda", code: "BR24" },
      { name: "Nawada", code: "BR25" },
      { name: "Patna", code: "BR26" },
      { name: "Purnia", code: "BR27" },
      { name: "Rohtas", code: "BR28" },
      { name: "Saharsa", code: "BR29" },
      { name: "Samastipur", code: "BR30" },
      { name: "Saran", code: "BR31" },
      { name: "Sheikhpura", code: "BR32" },
      { name: "Sheohar", code: "BR33" },
      { name: "Sitamarhi", code: "BR34" },
      { name: "Siwan", code: "BR35" },
      { name: "Supaul", code: "BR36" },
      { name: "Vaishali", code: "BR37" },
      { name: "West Champaran", code: "BR38" }
    ]
  },
  {
    state: "Madhya Pradesh",
    state_code: "MP",
    districts: [
      { name: "Agar Malwa", code: "MP01" },
      { name: "Alirajpur", code: "MP02" },
      { name: "Anuppur", code: "MP03" },
      { name: "Ashoknagar", code: "MP04" },
      { name: "Balaghat", code: "MP05" },
      { name: "Barwani", code: "MP06" },
      { name: "Betul", code: "MP07" },
      { name: "Bhind", code: "MP08" },
      { name: "Bhopal", code: "MP09" },
      { name: "Burhanpur", code: "MP10" },
      { name: "Chhatarpur", code: "MP11" },
      { name: "Chhindwara", code: "MP12" },
      { name: "Damoh", code: "MP13" },
      { name: "Datia", code: "MP14" },
      { name: "Dewas", code: "MP15" },
      { name: "Dhar", code: "MP16" },
      { name: "Dindori", code: "MP17" },
      { name: "Guna", code: "MP18" },
      { name: "Gwalior", code: "MP19" },
      { name: "Harda", code: "MP20" },
      { name: "Hoshangabad", code: "MP21" },
      { name: "Indore", code: "MP22" },
      { name: "Jabalpur", code: "MP23" },
      { name: "Jhabua", code: "MP24" },
      { name: "Katni", code: "MP25" },
      { name: "Khandwa", code: "MP26" },
      { name: "Khargone", code: "MP27" },
      { name: "Mandla", code: "MP28" },
      { name: "Mandsaur", code: "MP29" },
      { name: "Morena", code: "MP30" },
      { name: "Narsinghpur", code: "MP31" },
      { name: "Neemuch", code: "MP32" },
      { name: "Niwari", code: "MP33" },
      { name: "Panna", code: "MP34" },
      { name: "Raisen", code: "MP35" },
      { name: "Rajgarh", code: "MP36" },
      { name: "Ratlam", code: "MP37" },
      { name: "Rewa", code: "MP38" },
      { name: "Sagar", code: "MP39" },
      { name: "Satna", code: "MP40" },
      { name: "Sehore", code: "MP41" },
      { name: "Seoni", code: "MP42" },
      { name: "Shahdol", code: "MP43" },
      { name: "Shajapur", code: "MP44" },
      { name: "Sheopur", code: "MP45" },
      { name: "Shivpuri", code: "MP46" },
      { name: "Sidhi", code: "MP47" },
      { name: "Singrauli", code: "MP48" },
      { name: "Tikamgarh", code: "MP49" },
      { name: "Ujjain", code: "MP50" },
      { name: "Umaria", code: "MP51" },
      { name: "Vidisha", code: "MP52" }
    ]
  },
  {
    state: "Uttar Pradesh",
    state_code: "UP",
    districts: [
      { name: "Agra", code: "UP01" },
      { name: "Aligarh", code: "UP02" },
      { name: "Ambedkar Nagar", code: "UP03" },
      { name: "Amethi", code: "UP04" },
      { name: "Amroha", code: "UP05" },
      { name: "Auraiya", code: "UP06" },
      { name: "Azamgarh", code: "UP07" },
      { name: "Baghpat", code: "UP08" },
      { name: "Bahraich", code: "UP09" },
      { name: "Ballia", code: "UP10" },
      { name: "Balrampur", code: "UP11" },
      { name: "Banda", code: "UP12" },
      { name: "Barabanki", code: "UP13" },
      { name: "Bareilly", code: "UP14" },
      { name: "Basti", code: "UP15" },
      { name: "Bhadohi", code: "UP16" },
      { name: "Bijnor", code: "UP17" },
      { name: "Budaun", code: "UP18" },
      { name: "Bulandshahr", code: "UP19" },
      { name: "Chandauli", code: "UP20" },
      { name: "Chitrakoot", code: "UP21" },
      { name: "Deoria", code: "UP22" },
      { name: "Etah", code: "UP23" },
      { name: "Etawah", code: "UP24" },
      { name: "Ayodhya", code: "UP25" },
      { name: "Farrukhabad", code: "UP26" },
      { name: "Fatehpur", code: "UP27" },
      { name: "Firozabad", code: "UP28" },
      { name: "Gautam Buddha Nagar", code: "UP29" },
      { name: "Ghaziabad", code: "UP30" },
      { name: "Ghazipur", code: "UP31" },
      { name: "Gonda", code: "UP32" },
      { name: "Gorakhpur", code: "UP33" },
      { name: "Hamirpur", code: "UP34" },
      { name: "Hapur", code: "UP35" },
      { name: "Hardoi", code: "UP36" },
      { name: "Hathras", code: "UP37" },
      { name: "Jalaun", code: "UP38" },
      { name: "Jaunpur", code: "UP39" },
      { name: "Jhansi", code: "UP40" },
      { name: "Kannauj", code: "UP41" },
      { name: "Kanpur Dehat", code: "UP42" },
      { name: "Kanpur Nagar", code: "UP43" },
      { name: "Kasganj", code: "UP44" },
      { name: "Kaushambi", code: "UP45" },
      { name: "Kushinagar", code: "UP46" },
      { name: "Lakhimpur Kheri", code: "UP47" },
      { name: "Lalitpur", code: "UP48" },
      { name: "Lucknow", code: "UP49" },
      { name: "Maharajganj", code: "UP50" },
      { name: "Mahoba", code: "UP51" },
      { name: "Mainpuri", code: "UP52" },
      { name: "Mathura", code: "UP53" },
      { name: "Mau", code: "UP54" },
      { name: "Meerut", code: "UP55" },
      { name: "Mirzapur", code: "UP56" },
      { name: "Moradabad", code: "UP57" },
      { name: "Muzaffarnagar", code: "UP58" },
      { name: "Pilibhit", code: "UP59" },
      { name: "Pratapgarh", code: "UP60" },
      { name: "Prayagraj", code: "UP61" },
      { name: "Raebareli", code: "UP62" },
      { name: "Rampur", code: "UP63" },
      { name: "Saharanpur", code: "UP64" },
      { name: "Sambhal", code: "UP65" },
      { name: "Sant Kabir Nagar", code: "UP66" },
      { name: "Shahjahanpur", code: "UP67" },
      { name: "Shamli", code: "UP68" },
      { name: "Shrawasti", code: "UP69" },
      { name: "Siddharthnagar", code: "UP70" },
      { name: "Sitapur", code: "UP71" },
      { name: "Sonbhadra", code: "UP72" },
      { name: "Sultanpur", code: "UP73" },
      { name: "Unnao", code: "UP74" },
      { name: "Varanasi", code: "UP75" }
    ]
  },
  {
    state: "West Bengal",
    state_code: "WB",
    districts: [
      { name: "Alipurduar", code: "WB01" },
      { name: "Bankura", code: "WB02" },
      { name: "Birbhum", code: "WB03" },
      { name: "Cooch Behar", code: "WB04" },
      { name: "Dakshin Dinajpur", code: "WB05" },
      { name: "Darjeeling", code: "WB06" },
      { name: "Hooghly", code: "WB07" },
      { name: "Howrah", code: "WB08" },
      { name: "Jalpaiguri", code: "WB09" },
      { name: "Jhargram", code: "WB10" },
      { name: "Kalimpong", code: "WB11" },
      { name: "Kolkata", code: "WB12" },
      { name: "Malda", code: "WB13" },
      { name: "Murshidabad", code: "WB14" },
      { name: "Nadia", code: "WB15" },
      { name: "North 24 Parganas", code: "WB16" },
      { name: "Paschim Bardhaman", code: "WB17" },
      { name: "Paschim Medinipur", code: "WB18" },
      { name: "Purba Bardhaman", code: "WB19" },
      { name: "Purba Medinipur", code: "WB20" },
      { name: "Purulia", code: "WB21" },
      { name: "South 24 Parganas", code: "WB22" },
      { name: "Uttar Dinajpur", code: "WB23" }
    ]
  },
  {
    state: "Rajasthan",
    state_code: "RJ",
    districts: [
      { name: "Ajmer", code: "RJ01" },
      { name: "Alwar", code: "RJ02" },
      { name: "Banswara", code: "RJ03" },
      { name: "Baran", code: "RJ04" },
      { name: "Barmer", code: "RJ05" },
      { name: "Bharatpur", code: "RJ06" },
      { name: "Bhilwara", code: "RJ07" },
      { name: "Bikaner", code: "RJ08" },
      { name: "Bundi", code: "RJ09" },
      { name: "Chittorgarh", code: "RJ10" },
      { name: "Churu", code: "RJ11" },
      { name: "Dausa", code: "RJ12" },
      { name: "Dholpur", code: "RJ13" },
      { name: "Dungarpur", code: "RJ14" },
      { name: "Ganganagar", code: "RJ15" },
      { name: "Hanumangarh", code: "RJ16" },
      { name: "Jaipur", code: "RJ17" },
      { name: "Jaisalmer", code: "RJ18" },
      { name: "Jalore", code: "RJ19" },
      { name: "Jhalawar", code: "RJ20" },
      { name: "Jhunjhunu", code: "RJ21" },
      { name: "Jodhpur", code: "RJ22" },
      { name: "Karauli", code: "RJ23" },
      { name: "Kota", code: "RJ24" },
      { name: "Nagaur", code: "RJ25" },
      { name: "Pali", code: "RJ26" },
      { name: "Pratapgarh", code: "RJ27" },
      { name: "Rajsamand", code: "RJ28" },
      { name: "Sawai Madhopur", code: "RJ29" },
      { name: "Sikar", code: "RJ30" },
      { name: "Sirohi", code: "RJ31" },
      { name: "Tonk", code: "RJ32" },
      { name: "Udaipur", code: "RJ33" }
    ]
  }
];

// Generate realistic MGNREGA performance data
function generateRealisticPerformanceData(state, district, stateCode, districtCode, year = "2024-25", months = null) {
  const monthsArray = months || ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];
  const data = [];

  // State-wise base parameters for more realistic data
  const stateParams = {
    "Uttar Pradesh": { basePop: 50000, wageRate: 220, workIntensity: 0.7 },
    "Bihar": { basePop: 35000, wageRate: 210, workIntensity: 0.8 },
    "Madhya Pradesh": { basePop: 25000, wageRate: 230, workIntensity: 0.75 },
    "Rajasthan": { basePop: 20000, wageRate: 240, workIntensity: 0.65 },
    "West Bengal": { basePop: 30000, wageRate: 220, workIntensity: 0.7 },
    "Andhra Pradesh": { basePop: 28000, wageRate: 250, workIntensity: 0.72 }
  };

  const params = stateParams[state] || { basePop: 25000, wageRate: 225, workIntensity: 0.7 };

  monthsArray.forEach((month, index) => {
    // Seasonal variations
    const seasonMultiplier = month === "April" || month === "May" || month === "June" ? 1.3 :
                           month === "July" || month === "August" || month === "September" ? 0.8 :
                           month === "October" || month === "November" || month === "December" ? 1.1 : 1.0;

    const households = Math.floor(params.basePop * (0.8 + Math.random() * 0.4) * seasonMultiplier);
    const persondays = Math.floor(households * (15 + Math.random() * 20) * params.workIntensity);
    const avgWage = Math.floor(params.wageRate + (Math.random() - 0.5) * 30);
    const totalExp = Math.floor(persondays * avgWage * (0.95 + Math.random() * 0.1));
    
    const womenPersondays = Math.floor(persondays * (0.45 + Math.random() * 0.1));
    const scPersondays = Math.floor(persondays * (0.12 + Math.random() * 0.08));
    const stPersondays = Math.floor(persondays * (0.05 + Math.random() * 0.1));

    data.push({
      fin_year: year,
      month: month,
      state_code: stateCode,
      state_name: state,
      district_code: districtCode,
      district_name: district,
      approved_labour_budget: Math.floor(totalExp * (1.2 + Math.random() * 0.3)),
      average_wage_rate_per_day: avgWage,
      average_days_of_employment: Math.floor(15 + Math.random() * 20),
      differently_abled_persons_worked: Math.floor(households * (0.02 + Math.random() * 0.02)),
      material_and_skilled_wages: Math.floor(totalExp * (0.25 + Math.random() * 0.1)),
      number_of_completed_works: Math.floor(50 + Math.random() * 200),
      number_of_gps_with_nil_exp: Math.floor(Math.random() * 20),
      number_of_ongoing_works: Math.floor(30 + Math.random() * 100),
      persondays_of_central_liability: persondays,
      sc_persondays: scPersondays,
      sc_workers_against_active_workers: Math.floor(households * (0.12 + Math.random() * 0.08)),
      st_persondays: stPersondays,
      st_workers_against_active_workers: Math.floor(households * (0.05 + Math.random() * 0.1)),
      total_adm_expenditure: Math.floor(totalExp * (0.05 + Math.random() * 0.03)),
      total_exp: totalExp,
      total_households_worked: households,
      total_individuals_worked: Math.floor(households * (1.3 + Math.random() * 0.4)),
      total_active_job_cards: Math.floor(households * (1.5 + Math.random() * 0.5)),
      total_active_workers: Math.floor(households * (1.4 + Math.random() * 0.3)),
      total_hhs_completed_100_days: Math.floor(households * (0.15 + Math.random() * 0.1)),
      total_job_cards_issued: Math.floor(households * (1.8 + Math.random() * 0.4)),
      total_workers: Math.floor(households * (1.6 + Math.random() * 0.4)),
      total_works_takenup: Math.floor(80 + Math.random() * 300),
      wages: Math.floor(totalExp * (0.7 + Math.random() * 0.15)),
      women_persondays: womenPersondays,
      percent_category_b_works: Math.floor(20 + Math.random() * 40),
      percent_expenditure_agriculture: Math.floor(15 + Math.random() * 25),
      percent_nrm_expenditure: Math.floor(40 + Math.random() * 30),
      percentage_payments_within_15_days: Math.floor(60 + Math.random() * 35),
      remarks: `Data for ${month} ${year}`,
      // Calculated fields
      persondays_generated: persondays,
      avg_wage_per_day: avgWage,
      total_expenditure: totalExp,
      ongoing_works: Math.floor(30 + Math.random() * 100)
    });
  });

  return data;
}

class DatabaseSeeder {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      }
      this.isConnected = true;
      console.log('✅ Connected to MongoDB for seeding');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      throw error;
    }
  }

  async seedStatesAndDistricts() {
    try {
      console.log('🌱 Seeding states and districts...');
      
      // Clear existing data
      await StateDistrict.deleteMany({});
      
      // Insert new data
      await StateDistrict.insertMany(realStatesDistrictsData);
      
      console.log(`✅ Successfully seeded ${realStatesDistrictsData.length} states with districts`);
      return true;
    } catch (error) {
      console.error('❌ Error seeding states and districts:', error.message);
      throw error;
    }
  }

  async seedPerformanceData(limitStates = null, limitDistricts = null) {
    try {
      console.log('🌱 Seeding performance data...');
      
      // Clear existing performance data
      await PerformanceData.deleteMany({});
      
      const performanceDataBatch = [];
      let processedStates = 0;
      
      for (const stateData of realStatesDistrictsData) {
        if (limitStates && processedStates >= limitStates) break;
        
        console.log(`📊 Processing ${stateData.state}...`);
        let processedDistricts = 0;
        
        for (const district of stateData.districts) {
          if (limitDistricts && processedDistricts >= limitDistricts) break;
          
          // Generate data for 2024-25 (current year)
          const currentYearData = generateRealisticPerformanceData(
            stateData.state, 
            district.name, 
            stateData.state_code, 
            district.code,
            "2024-25"
          );
          
          // Generate limited data for 2023-24 (previous year)
          const previousYearData = generateRealisticPerformanceData(
            stateData.state, 
            district.name, 
            stateData.state_code, 
            district.code,
            "2023-24",
            ["January", "February", "March"] // Only last 3 months
          );
          
          performanceDataBatch.push(...currentYearData, ...previousYearData);
          processedDistricts++;
          
          // Insert in batches to avoid memory issues
          if (performanceDataBatch.length >= 500) {
            await PerformanceData.insertMany(performanceDataBatch);
            performanceDataBatch.length = 0; // Clear the array
            console.log(`  📈 Batch inserted for ${stateData.state}...`);
          }
        }
        
        processedStates++;
        console.log(`✅ Completed ${stateData.state} (${processedDistricts} districts)`);
      }
      
      // Insert remaining data
      if (performanceDataBatch.length > 0) {
        await PerformanceData.insertMany(performanceDataBatch);
      }
      
      const totalRecords = await PerformanceData.countDocuments();
      console.log(`✅ Successfully seeded ${totalRecords} performance data records`);
      
      return true;
    } catch (error) {
      console.error('❌ Error seeding performance data:', error.message);
      throw error;
    }
  }

  async seedAll(limitStates = null, limitDistricts = null) {
    try {
      await this.connect();
      
      console.log('🚀 Starting database seeding...');
      
      await this.seedStatesAndDistricts();
      await this.seedPerformanceData(limitStates, limitDistricts);
      
      // Generate summary
      const statesCount = await StateDistrict.countDocuments();
      const districtsCount = await StateDistrict.aggregate([
        { $unwind: '$districts' },
        { $count: 'total' }
      ]);
      const performanceCount = await PerformanceData.countDocuments();
      
      console.log('\n📊 Database Seeding Summary:');
      console.log(`   States: ${statesCount}`);
      console.log(`   Districts: ${districtsCount[0]?.total || 0}`);
      console.log(`   Performance Records: ${performanceCount}`);
      console.log('✅ Database seeding completed successfully!\n');
      
      return {
        states: statesCount,
        districts: districtsCount[0]?.total || 0,
        performanceRecords: performanceCount
      };
    } catch (error) {
      console.error('❌ Database seeding failed:', error.message);
      throw error;
    }
  }

  async seedSampleData() {
    // Seed limited data for testing (first 2 states, 5 districts each)
    return this.seedAll(2, 5);
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      console.log('👋 Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
    }
  }
}

module.exports = { DatabaseSeeder, realStatesDistrictsData };