// Mock data service for when MongoDB is not available
const statesDistrictsData = [
  {
    state: "Andhra Pradesh",
    state_code: "AP",
    districts: [
      { name: "Anantapur" }, { name: "Chittoor" }, { name: "East Godavari" },
      { name: "Guntur" }, { name: "Krishna" }, { name: "Kurnool" },
      { name: "Nellore" }, { name: "Prakasam" }, { name: "Srikakulam" },
      { name: "Visakhapatnam" }, { name: "Vizianagaram" }, { name: "West Godavari" },
      { name: "YSR Kadapa" }
    ]
  },
  {
    state: "Bihar",
    state_code: "BR",
    districts: [
      { name: "Araria" }, { name: "Arwal" }, { name: "Aurangabad" },
      { name: "Banka" }, { name: "Begusarai" }, { name: "Bhagalpur" },
      { name: "Bhojpur" }, { name: "Buxar" }, { name: "Darbhanga" },
      { name: "East Champaran" }, { name: "Gaya" }, { name: "Gopalganj" },
      { name: "Jamui" }, { name: "Jehanabad" }, { name: "Kaimur" },
      { name: "Katihar" }, { name: "Khagaria" }, { name: "Kishanganj" },
      { name: "Lakhisarai" }, { name: "Madhepura" }, { name: "Madhubani" },
      { name: "Munger" }, { name: "Muzaffarpur" }, { name: "Nalanda" },
      { name: "Nawada" }, { name: "Patna" }, { name: "Purnia" },
      { name: "Rohtas" }, { name: "Saharsa" }, { name: "Samastipur" },
      { name: "Saran" }, { name: "Sheikhpura" }, { name: "Sheohar" },
      { name: "Sitamarhi" }, { name: "Siwan" }, { name: "Supaul" },
      { name: "Vaishali" }, { name: "West Champaran" }
    ]
  },
  {
    state: "Madhya Pradesh",
    state_code: "MP",
    districts: [
      { name: "Agar Malwa" }, { name: "Alirajpur" }, { name: "Anuppur" },
      { name: "Ashoknagar" }, { name: "Balaghat" }, { name: "Barwani" },
      { name: "Betul" }, { name: "Bhind" }, { name: "Bhopal" },
      { name: "Burhanpur" }, { name: "Chhatarpur" }, { name: "Chhindwara" },
      { name: "Damoh" }, { name: "Datia" }, { name: "Dewas" },
      { name: "Dhar" }, { name: "Dindori" }, { name: "Guna" },
      { name: "Gwalior" }, { name: "Harda" }, { name: "Hoshangabad" },
      { name: "Indore" }, { name: "Jabalpur" }, { name: "Jhabua" },
      { name: "Katni" }, { name: "Khandwa" }, { name: "Khargone" },
      { name: "Mandla" }, { name: "Mandsaur" }, { name: "Morena" },
      { name: "Narsinghpur" }, { name: "Neemuch" }, { name: "Niwari" },
      { name: "Panna" }, { name: "Raisen" }, { name: "Rajgarh" },
      { name: "Ratlam" }, { name: "Rewa" }, { name: "Sagar" },
      { name: "Satna" }, { name: "Sehore" }, { name: "Seoni" },
      { name: "Shahdol" }, { name: "Shajapur" }, { name: "Sheopur" },
      { name: "Shivpuri" }, { name: "Sidhi" }, { name: "Singrauli" },
      { name: "Tikamgarh" }, { name: "Ujjain" }, { name: "Umaria" },
      { name: "Vidisha" }
    ]
  },
  {
    state: "Uttar Pradesh",
    state_code: "UP",
    districts: [
      { name: "Agra" }, { name: "Aligarh" }, { name: "Ambedkar Nagar" },
      { name: "Amethi" }, { name: "Amroha" }, { name: "Auraiya" },
      { name: "Azamgarh" }, { name: "Baghpat" }, { name: "Bahraich" },
      { name: "Ballia" }, { name: "Balrampur" }, { name: "Banda" },
      { name: "Barabanki" }, { name: "Bareilly" }, { name: "Basti" },
      { name: "Bhadohi" }, { name: "Bijnor" }, { name: "Budaun" },
      { name: "Bulandshahr" }, { name: "Chandauli" }, { name: "Chitrakoot" },
      { name: "Deoria" }, { name: "Etah" }, { name: "Etawah" },
      { name: "Ayodhya" }, { name: "Farrukhabad" }, { name: "Fatehpur" },
      { name: "Firozabad" }, { name: "Gautam Buddha Nagar" }, { name: "Ghaziabad" },
      { name: "Ghazipur" }, { name: "Gonda" }, { name: "Gorakhpur" },
      { name: "Hamirpur" }, { name: "Hapur" }, { name: "Hardoi" },
      { name: "Hathras" }, { name: "Jalaun" }, { name: "Jaunpur" },
      { name: "Jhansi" }, { name: "Kannauj" }, { name: "Kanpur Dehat" },
      { name: "Kanpur Nagar" }, { name: "Kasganj" }, { name: "Kaushambi" },
      { name: "Kushinagar" }, { name: "Lakhimpur Kheri" }, { name: "Lalitpur" },
      { name: "Lucknow" }, { name: "Maharajganj" }, { name: "Mahoba" },
      { name: "Mainpuri" }, { name: "Mathura" }, { name: "Mau" },
      { name: "Meerut" }, { name: "Mirzapur" }, { name: "Moradabad" },
      { name: "Muzaffarnagar" }, { name: "Pilibhit" }, { name: "Pratapgarh" },
      { name: "Prayagraj" }, { name: "Raebareli" }, { name: "Rampur" },
      { name: "Saharanpur" }, { name: "Sambhal" }, { name: "Sant Kabir Nagar" },
      { name: "Shahjahanpur" }, { name: "Shamli" }, { name: "Shrawasti" },
      { name: "Siddharthnagar" }, { name: "Sitapur" }, { name: "Sonbhadra" },
      { name: "Sultanpur" }, { name: "Unnao" }, { name: "Varanasi" }
    ]
  },
  {
    state: "West Bengal",
    state_code: "WB",
    districts: [
      { name: "Alipurduar" }, { name: "Bankura" }, { name: "Birbhum" },
      { name: "Cooch Behar" }, { name: "Dakshin Dinajpur" }, { name: "Darjeeling" },
      { name: "Hooghly" }, { name: "Howrah" }, { name: "Jalpaiguri" },
      { name: "Jhargram" }, { name: "Kalimpong" }, { name: "Kolkata" },
      { name: "Malda" }, { name: "Murshidabad" }, { name: "Nadia" },
      { name: "North 24 Parganas" }, { name: "Paschim Bardhaman" }, { name: "Paschim Medinipur" },
      { name: "Purba Bardhaman" }, { name: "Purba Medinipur" }, { name: "Purulia" },
      { name: "South 24 Parganas" }, { name: "Uttar Dinajpur" }
    ]
  }
];

function generateMockPerformanceData(state, district) {
  const baseHouseholds = Math.floor(Math.random() * 10000) + 2000;
  const basePersondays = baseHouseholds * (Math.floor(Math.random() * 40) + 15);
  const baseWage = Math.floor(Math.random() * 100) + 200;
  
  return {
    fin_year: "2024-2025",
    month: "August",
    state_name: state,
    district_name: district,
    total_households_worked: baseHouseholds,
    persondays_of_central_liability: basePersondays,
    average_wage_rate_per_day: baseWage,
    total_exp: basePersondays * baseWage,
    number_of_ongoing_works: Math.floor(Math.random() * 100) + 20,
    number_of_completed_works: Math.floor(Math.random() * 150) + 50,
    women_persondays: Math.floor(basePersondays * 0.48),
    sc_persondays: Math.floor(basePersondays * 0.15),
    st_persondays: Math.floor(basePersondays * 0.08),
    percentage_payments_within_15_days: Math.floor(Math.random() * 40) + 60
  };
}

class MockDataService {
  static getAllStates() {
    return statesDistrictsData.map(state => ({
      state: state.state,
      state_code: state.state_code
    }));
  }

  static getDistrictsByState(stateName) {
    const stateData = statesDistrictsData.find(s => s.state === stateName);
    return stateData ? { districts: stateData.districts } : null;
  }

  static searchDistricts(searchTerm) {
    const results = [];
    statesDistrictsData.forEach(state => {
      state.districts.forEach(district => {
        if (district.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            state: state.state,
            district: district.name
          });
        }
      });
    });
    return results;
  }

  static getDistrictPerformance(state, district) {
    return [generateMockPerformanceData(state, district)];
  }

  static getStateAverage(state, year, month) {
    const stateData = statesDistrictsData.find(s => s.state === state);
    if (!stateData) return [];

    return [{
      _id: null,
      avg_households_worked: 5000,
      avg_persondays_generated: 150000,
      avg_wage_per_day: 250,
      avg_expenditure: 37500000,
      avg_ongoing_works: 60,
      total_districts: stateData.districts.length
    }];
  }

  static getNationalAverage(year, month) {
    return [{
      _id: null,
      avg_households_worked: 4500,
      avg_persondays_generated: 135000,
      avg_wage_per_day: 245,
      avg_expenditure: 33000000,
      avg_ongoing_works: 55,
      total_districts: 750
    }];
  }
}

module.exports = { MockDataService, statesDistrictsData };