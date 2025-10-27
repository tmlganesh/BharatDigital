const mongoose = require('mongoose');
const { PerformanceData, StateDistrict } = require('./models');
require('dotenv').config({ path: '../.env' });

console.log('🌱 Setting up sample MGNREGA data...');

// Sample states and districts data based on real Indian states
const statesDistrictsData = [
  {
    state: "Andhra Pradesh",
    state_code: "AP",
    districts: [
      { name: "Anantapur", code: "ANT" },
      { name: "Chittoor", code: "CTR" },
      { name: "East Godavari", code: "EG" },
      { name: "Guntur", code: "GNT" },
      { name: "Krishna", code: "KRS" },
      { name: "Kurnool", code: "KNL" },
      { name: "Nellore", code: "NLR" },
      { name: "Prakasam", code: "PKM" },
      { name: "Srikakulam", code: "SKL" },
      { name: "Visakhapatnam", code: "VSK" },
      { name: "Vizianagaram", code: "VZG" },
      { name: "West Godavari", code: "WG" },
      { name: "YSR Kadapa", code: "YSR" }
    ]
  },
  {
    state: "Bihar",
    state_code: "BR",
    districts: [
      { name: "Araria", code: "ARA" },
      { name: "Arwal", code: "ARW" },
      { name: "Aurangabad", code: "AUR" },
      { name: "Banka", code: "BNK" },
      { name: "Begusarai", code: "BGS" },
      { name: "Bhagalpur", code: "BGP" },
      { name: "Bhojpur", code: "BHP" },
      { name: "Buxar", code: "BXR" },
      { name: "Darbhanga", code: "DBG" },
      { name: "East Champaran", code: "ECH" },
      { name: "Gaya", code: "GYA" },
      { name: "Gopalganj", code: "GPG" },
      { name: "Jamui", code: "JAM" },
      { name: "Jehanabad", code: "JEH" },
      { name: "Kaimur", code: "KMR" },
      { name: "Katihar", code: "KTH" },
      { name: "Khagaria", code: "KHG" },
      { name: "Kishanganj", code: "KSG" },
      { name: "Lakhisarai", code: "LKS" },
      { name: "Madhepura", code: "MDP" },
      { name: "Madhubani", code: "MDB" },
      { name: "Munger", code: "MNG" },
      { name: "Muzaffarpur", code: "MZP" },
      { name: "Nalanda", code: "NLD" },
      { name: "Nawada", code: "NWD" },
      { name: "Patna", code: "PTN" },
      { name: "Purnia", code: "PRN" },
      { name: "Rohtas", code: "RHT" },
      { name: "Saharsa", code: "SHR" },
      { name: "Samastipur", code: "SMP" },
      { name: "Saran", code: "SRN" },
      { name: "Sheikhpura", code: "SHP" },
      { name: "Sheohar", code: "SHH" },
      { name: "Sitamarhi", code: "STM" },
      { name: "Siwan", code: "SWN" },
      { name: "Supaul", code: "SPL" },
      { name: "Vaishali", code: "VSH" },
      { name: "West Champaran", code: "WCH" }
    ]
  },
  {
    state: "Madhya Pradesh",
    state_code: "MP",
    districts: [
      { name: "Agar Malwa", code: "AGM" },
      { name: "Alirajpur", code: "ALP" },
      { name: "Anuppur", code: "ANP" },
      { name: "Ashoknagar", code: "ASH" },
      { name: "Balaghat", code: "BLG" },
      { name: "Barwani", code: "BWN" },
      { name: "Betul", code: "BTL" },
      { name: "Bhind", code: "BHD" },
      { name: "Bhopal", code: "BPL" },
      { name: "Burhanpur", code: "BHP" },
      { name: "Chhatarpur", code: "CHP" },
      { name: "Chhindwara", code: "CHD" },
      { name: "Damoh", code: "DMH" },
      { name: "Datia", code: "DTA" },
      { name: "Dewas", code: "DWS" },
      { name: "Dhar", code: "DHR" },
      { name: "Dindori", code: "DND" },
      { name: "Guna", code: "GNA" },
      { name: "Gwalior", code: "GWL" },
      { name: "Harda", code: "HRD" },
      { name: "Hoshangabad", code: "HSB" },
      { name: "Indore", code: "IDR" },
      { name: "Jabalpur", code: "JBP" },
      { name: "Jhabua", code: "JHB" },
      { name: "Katni", code: "KTN" },
      { name: "Khandwa", code: "KHD" },
      { name: "Khargone", code: "KHG" },
      { name: "Mandla", code: "MND" },
      { name: "Mandsaur", code: "MDS" },
      { name: "Morena", code: "MOR" },
      { name: "Narsinghpur", code: "NSP" },
      { name: "Neemuch", code: "NMC" },
      { name: "Niwari", code: "NWR" },
      { name: "Panna", code: "PNN" },
      { name: "Raisen", code: "RSN" },
      { name: "Rajgarh", code: "RJG" },
      { name: "Ratlam", code: "RTM" },
      { name: "Rewa", code: "RWA" },
      { name: "Sagar", code: "SGR" },
      { name: "Satna", code: "STN" },
      { name: "Sehore", code: "SHR" },
      { name: "Seoni", code: "SNI" },
      { name: "Shahdol", code: "SHD" },
      { name: "Shajapur", code: "SJP" },
      { name: "Sheopur", code: "SHP" },
      { name: "Shivpuri", code: "SHP" },
      { name: "Sidhi", code: "SDH" },
      { name: "Singrauli", code: "SNG" },
      { name: "Tikamgarh", code: "TKG" },
      { name: "Ujjain", code: "UJN" },
      { name: "Umaria", code: "UMA" },
      { name: "Vidisha", code: "VDS" }
    ]
  },
  {
    state: "Uttar Pradesh",
    state_code: "UP",
    districts: [
      { name: "Agra", code: "AGR" },
      { name: "Aligarh", code: "ALG" },
      { name: "Ambedkar Nagar", code: "AMN" },
      { name: "Amethi", code: "AMT" },
      { name: "Amroha", code: "AMR" },
      { name: "Auraiya", code: "AUR" },
      { name: "Azamgarh", code: "AZM" },
      { name: "Baghpat", code: "BGP" },
      { name: "Bahraich", code: "BHR" },
      { name: "Ballia", code: "BLL" },
      { name: "Balrampur", code: "BRP" },
      { name: "Banda", code: "BND" },
      { name: "Barabanki", code: "BBK" },
      { name: "Bareilly", code: "BRL" },
      { name: "Basti", code: "BST" },
      { name: "Bhadohi", code: "BDH" },
      { name: "Bijnor", code: "BJN" },
      { name: "Budaun", code: "BDN" },
      { name: "Bulandshahr", code: "BLS" },
      { name: "Chandauli", code: "CHD" },
      { name: "Chitrakoot", code: "CTK" },
      { name: "Deoria", code: "DOR" },
      { name: "Etah", code: "ETH" },
      { name: "Etawah", code: "ETW" },
      { name: "Ayodhya", code: "AYD" },
      { name: "Farrukhabad", code: "FRK" },
      { name: "Fatehpur", code: "FTP" },
      { name: "Firozabad", code: "FZB" },
      { name: "Gautam Buddha Nagar", code: "GBN" },
      { name: "Ghaziabad", code: "GZB" },
      { name: "Ghazipur", code: "GZP" },
      { name: "Gonda", code: "GND" },
      { name: "Gorakhpur", code: "GKP" },
      { name: "Hamirpur", code: "HMP" },
      { name: "Hapur", code: "HPR" },
      { name: "Hardoi", code: "HDI" },
      { name: "Hathras", code: "HTR" },
      { name: "Jalaun", code: "JLN" },
      { name: "Jaunpur", code: "JNP" },
      { name: "Jhansi", code: "JHS" },
      { name: "Kannauj", code: "KNJ" },
      { name: "Kanpur Dehat", code: "KPD" },
      { name: "Kanpur Nagar", code: "KPN" },
      { name: "Kasganj", code: "KSG" },
      { name: "Kaushambi", code: "KSB" },
      { name: "Kushinagar", code: "KSN" },
      { name: "Lakhimpur Kheri", code: "LKK" },
      { name: "Lalitpur", code: "LTP" },
      { name: "Lucknow", code: "LKO" },
      { name: "Maharajganj", code: "MRG" },
      { name: "Mahoba", code: "MHB" },
      { name: "Mainpuri", code: "MNP" },
      { name: "Mathura", code: "MTR" },
      { name: "Mau", code: "MAU" },
      { name: "Meerut", code: "MRT" },
      { name: "Mirzapur", code: "MZP" },
      { name: "Moradabad", code: "MRD" },
      { name: "Muzaffarnagar", code: "MZN" },
      { name: "Pilibhit", code: "PLB" },
      { name: "Pratapgarh", code: "PTG" },
      { name: "Prayagraj", code: "PRY" },
      { name: "Raebareli", code: "RBL" },
      { name: "Rampur", code: "RMP" },
      { name: "Saharanpur", code: "SHP" },
      { name: "Sambhal", code: "SMB" },
      { name: "Sant Kabir Nagar", code: "SKN" },
      { name: "Shahjahanpur", code: "SJP" },
      { name: "Shamli", code: "SML" },
      { name: "Shrawasti", code: "SRW" },
      { name: "Siddharthnagar", code: "SDN" },
      { name: "Sitapur", code: "STP" },
      { name: "Sonbhadra", code: "SNB" },
      { name: "Sultanpur", code: "SLT" },
      { name: "Unnao", code: "UNN" },
      { name: "Varanasi", code: "VNS" }
    ]
  },
  {
    state: "West Bengal",
    state_code: "WB",
    districts: [
      { name: "Alipurduar", code: "ALP" },
      { name: "Bankura", code: "BNK" },
      { name: "Birbhum", code: "BRB" },
      { name: "Cooch Behar", code: "CBH" },
      { name: "Dakshin Dinajpur", code: "DDN" },
      { name: "Darjeeling", code: "DRJ" },
      { name: "Hooghly", code: "HGH" },
      { name: "Howrah", code: "HWH" },
      { name: "Jalpaiguri", code: "JPG" },
      { name: "Jhargram", code: "JHG" },
      { name: "Kalimpong", code: "KLP" },
      { name: "Kolkata", code: "KOL" },
      { name: "Malda", code: "MLD" },
      { name: "Murshidabad", code: "MSD" },
      { name: "Nadia", code: "NDA" },
      { name: "North 24 Parganas", code: "N24" },
      { name: "Paschim Bardhaman", code: "PBD" },
      { name: "Paschim Medinipur", code: "PMD" },
      { name: "Purba Bardhaman", code: "PBR" },
      { name: "Purba Medinipur", code: "PMR" },
      { name: "Purulia", code: "PRL" },
      { name: "South 24 Parganas", code: "S24" },
      { name: "Uttar Dinajpur", code: "UDN" }
    ]
  }
];

// Function to generate realistic MGNREGA performance data
function generatePerformanceData(state, district, year, month) {
  const baseHouseholds = Math.floor(Math.random() * 15000) + 2000;
  const basePersondays = baseHouseholds * (Math.floor(Math.random() * 40) + 15);
  const baseWage = Math.floor(Math.random() * 150) + 180; // Rs 180-330 per day
  
  return {
    fin_year: year,
    month,
    state_code: statesDistrictsData.find(s => s.state === state)?.state_code || 'XX',
    state_name: state,
    district_code: statesDistrictsData.find(s => s.state === state)?.districts.find(d => d.name === district)?.code || 'XXX',
    district_name: district,
    approved_labour_budget: baseHouseholds * 100 * 200, // Rough calculation
    average_wage_rate_per_day: baseWage,
    average_days_of_employment: Math.floor(Math.random() * 60) + 20,
    differently_abled_persons_worked: Math.floor(Math.random() * 50),
    material_and_skilled_wages: basePersondays * baseWage * 0.4, // 40% for materials/skilled
    number_of_completed_works: Math.floor(Math.random() * 200) + 50,
    number_of_gps_with_nil_exp: Math.floor(Math.random() * 10),
    number_of_ongoing_works: Math.floor(Math.random() * 150) + 30,
    persondays_of_central_liability: basePersondays,
    sc_persondays: Math.floor(basePersondays * 0.15), // 15% SC
    sc_workers_against_active_workers: Math.floor(Math.random() * 20) + 10,
    st_persondays: Math.floor(basePersondays * 0.08), // 8% ST
    st_workers_against_active_workers: Math.floor(Math.random() * 15) + 5,
    total_adm_expenditure: basePersondays * baseWage * 0.06, // 6% admin
    total_exp: basePersondays * baseWage,
    total_households_worked: baseHouseholds,
    total_individuals_worked: Math.floor(baseHouseholds * 1.4), // 1.4 workers per household on average
    total_active_job_cards: Math.floor(baseHouseholds * 1.2),
    total_active_workers: Math.floor(baseHouseholds * 1.6),
    total_hhs_completed_100_days: Math.floor(baseHouseholds * 0.12), // 12% complete 100 days
    total_job_cards_issued: Math.floor(baseHouseholds * 1.5),
    total_workers: Math.floor(baseHouseholds * 1.8),
    total_works_takenup: Math.floor(Math.random() * 300) + 100,
    wages: basePersondays * baseWage * 0.6, // 60% for wages
    women_persondays: Math.floor(basePersondays * 0.48), // 48% women participation
    percent_category_b_works: Math.floor(Math.random() * 30) + 10,
    percent_expenditure_agriculture: Math.floor(Math.random() * 25) + 15,
    percent_nrm_expenditure: Math.floor(Math.random() * 35) + 25,
    percentage_payments_within_15_days: Math.floor(Math.random() * 40) + 60,
    remarks: 'Sample data'
  };
}

async function setupSampleData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await PerformanceData.deleteMany({});
    await StateDistrict.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert states and districts
    console.log('🏛️ Inserting states and districts...');
    await StateDistrict.insertMany(statesDistrictsData);
    console.log(`✅ Inserted ${statesDistrictsData.length} states with districts`);

    // Generate performance data for the last 12 months
    console.log('📊 Generating performance data...');
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = ['2023-2024', '2024-2025'];
    const performanceData = [];

    let totalRecords = 0;
    for (const stateInfo of statesDistrictsData) {
      for (const district of stateInfo.districts) {
        for (const year of years) {
          // Generate data for some months (not all to make it realistic)
          const monthsToGenerate = year === '2024-2025' ? 
            months.slice(0, 8) : // Current year: Jan-Aug
            months.slice(6); // Previous year: July-Dec
          
          for (const month of monthsToGenerate) {
            performanceData.push(
              generatePerformanceData(stateInfo.state, district.name, year, month)
            );
            totalRecords++;
            
            // Insert in batches to avoid memory issues
            if (performanceData.length >= 500) {
              await PerformanceData.insertMany(performanceData);
              console.log(`✅ Inserted batch of ${performanceData.length} records (Total: ${totalRecords})`);
              performanceData.length = 0; // Clear array
            }
          }
        }
      }
    }

    // Insert remaining records
    if (performanceData.length > 0) {
      await PerformanceData.insertMany(performanceData);
      console.log(`✅ Inserted final batch of ${performanceData.length} records`);
    }

    console.log(`🎉 Successfully inserted ${totalRecords} performance records`);

    // Verify the data
    const stateCount = await StateDistrict.countDocuments();
    const performanceCount = await PerformanceData.countDocuments();
    
    console.log('\n📊 Data Summary:');
    console.log(`   States: ${stateCount}`);
    console.log(`   Performance Records: ${performanceCount}`);

    // Test the getAllStates method
    console.log('\n🧪 Testing getAllStates method...');
    const states = await StateDistrict.getAllStates();
    console.log(`   getAllStates returned: ${states.length} states`);
    
    if (states.length > 0) {
      console.log(`   Sample states: ${states.slice(0, 3).map(s => s.state).join(', ')}`);
    }

    console.log('\n🎉 Sample data setup completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error setting up sample data:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupSampleData();
}

module.exports = { setupSampleData, statesDistrictsData };
