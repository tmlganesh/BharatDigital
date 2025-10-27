// Mock data service for frontend when backend is not available
const mockStatesData = [
  { state: "Andhra Pradesh", state_code: "AP" },
  { state: "Bihar", state_code: "BR" },
  { state: "Madhya Pradesh", state_code: "MP" },
  { state: "Uttar Pradesh", state_code: "UP" },
  { state: "West Bengal", state_code: "WB" },
  { state: "Rajasthan", state_code: "RJ" },
  { state: "Odisha", state_code: "OR" },
  { state: "Karnataka", state_code: "KA" },
  { state: "Maharashtra", state_code: "MH" },
  { state: "Tamil Nadu", state_code: "TN" },
]

const mockDistrictsData = {
  "Andhra Pradesh": [
    { name: "Anantapur" }, { name: "Chittoor" }, { name: "East Godavari" },
    { name: "Guntur" }, { name: "Krishna" }, { name: "Kurnool" },
    { name: "Nellore" }, { name: "Prakasam" }, { name: "Srikakulam" },
    { name: "Visakhapatnam" }, { name: "Vizianagaram" }, { name: "West Godavari" }
  ],
  "Bihar": [
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
  ],
  "Madhya Pradesh": [
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
    { name: "Narsinghpur" }, { name: "Neemuch" }, { name: "Panna" },
    { name: "Raisen" }, { name: "Rajgarh" }, { name: "Ratlam" },
    { name: "Rewa" }, { name: "Sagar" }, { name: "Satna" },
    { name: "Sehore" }, { name: "Seoni" }, { name: "Shahdol" },
    { name: "Shajapur" }, { name: "Sheopur" }, { name: "Shivpuri" },
    { name: "Sidhi" }, { name: "Singrauli" }, { name: "Tikamgarh" },
    { name: "Ujjain" }, { name: "Umaria" }, { name: "Vidisha" }
  ],
  "Uttar Pradesh": [
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
    { name: "Shahjahanpur" }, { name: "Shamli" }, { name: "Shravasti" },
    { name: "Siddharthnagar" }, { name: "Sitapur" }, { name: "Sonbhadra" },
    { name: "Sultanpur" }, { name: "Unnao" }, { name: "Varanasi" }
  ]
}

const generateMockPerformanceData = (state, district) => {
  // Generate realistic mock data based on state/district
  const baseHouseholds = Math.floor(Math.random() * 8000) + 2000
  const personDays = Math.floor(baseHouseholds * (Math.random() * 40 + 20))
  const avgWage = Math.floor(Math.random() * 100) + 200
  const totalExp = personDays * avgWage * (Math.random() * 0.3 + 0.7)
  
  return {
    fin_year: "2024-2025",
    month: "October",
    state_name: state,
    district_name: district,
    total_households_worked: baseHouseholds,
    persondays_of_central_liability: personDays,
    average_wage_rate_per_day: avgWage,
    total_exp: Math.floor(totalExp),
    number_of_ongoing_works: Math.floor(Math.random() * 80) + 20,
    number_of_completed_works: Math.floor(Math.random() * 100) + 30,
    women_persondays: Math.floor(personDays * (Math.random() * 0.3 + 0.4)),
    sc_persondays: Math.floor(personDays * (Math.random() * 0.15 + 0.1)),
    st_persondays: Math.floor(personDays * (Math.random() * 0.1 + 0.05)),
    percentage_payments_within_15_days: Math.floor(Math.random() * 30) + 60
  }
}

export class MockAPI {
  static async getStates() {
    await this.delay(500) // Simulate network delay
    return {
      data: {
        success: true,
        data: {
          states: mockStatesData
        }
      }
    }
  }

  static async getDistricts(state) {
    await this.delay(300)
    const districts = mockDistrictsData[state] || []
    return {
      data: {
        success: true,
        data: {
          state: state,
          districts: districts
        }
      }
    }
  }

  static async getDistrictPerformance(state, district, params = {}) {
    await this.delay(700)
    const performanceData = generateMockPerformanceData(state, district)
    
    // Generate historical data
    const months = ['September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January', 'December', 'November', 'October']
    const historical = months.slice(0, params.limit || 12).map(month => ({
      ...generateMockPerformanceData(state, district),
      month: month,
      fin_year: month === 'December' || month === 'November' || month === 'October' ? "2023-2024" : "2024-2025"
    }))

    // Generate comparison data
    const stateAverage = {
      _id: null,
      avg_households_worked: performanceData.total_households_worked * (Math.random() * 0.4 + 0.8),
      avg_persondays_generated: performanceData.persondays_of_central_liability * (Math.random() * 0.4 + 0.8),
      avg_wage_per_day: performanceData.average_wage_rate_per_day * (Math.random() * 0.2 + 0.9),
      avg_expenditure: performanceData.total_exp * (Math.random() * 0.4 + 0.8),
      avg_ongoing_works: performanceData.number_of_ongoing_works * (Math.random() * 0.4 + 0.8),
      total_districts: Math.floor(Math.random() * 30) + 20
    }

    const nationalAverage = {
      _id: null,
      avg_households_worked: performanceData.total_households_worked * (Math.random() * 0.5 + 0.7),
      avg_persondays_generated: performanceData.persondays_of_central_liability * (Math.random() * 0.5 + 0.7),
      avg_wage_per_day: performanceData.average_wage_rate_per_day * (Math.random() * 0.3 + 0.8),
      avg_expenditure: performanceData.total_exp * (Math.random() * 0.5 + 0.7),
      avg_ongoing_works: performanceData.number_of_ongoing_works * (Math.random() * 0.5 + 0.7),
      total_districts: 750
    }

    // Calculate performance status
    let performanceStatus = null
    if (performanceData.total_households_worked > stateAverage.avg_households_worked * 1.1) {
      performanceStatus = 'Above Average'
    } else if (performanceData.total_households_worked < stateAverage.avg_households_worked * 0.9) {
      performanceStatus = 'Below Average'
    } else {
      performanceStatus = 'Average'
    }

    return {
      data: {
        success: true,
        data: {
          district: district,
          state: state,
          latest: performanceData,
          historical: historical,
          comparison: {
            state_average: stateAverage,
            national_average: nationalAverage,
            performance_status: performanceStatus
          }
        }
      }
    }
  }

  static async searchDistricts(query) {
    await this.delay(200)
    const allDistricts = []
    
    Object.entries(mockDistrictsData).forEach(([state, districts]) => {
      districts.forEach(district => {
        if (district.name.toLowerCase().includes(query.toLowerCase())) {
          allDistricts.push({
            ...district,
            state: state
          })
        }
      })
    })

    return {
      data: {
        success: true,
        data: {
          districts: allDistricts.slice(0, 20) // Limit results
        }
      }
    }
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default MockAPI