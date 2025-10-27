const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const { PerformanceData, StateDistrict } = require('./models');
require('dotenv').config({ path: '../.env' });

class OptimizedCSVLoader {
  constructor() {
    this.csvFilePath = '../data/ee03643a-ee4c-48c2-ac30-9f2ff26ab722_d2992207337c9ad7a159ae473f77b7bc.csv';
    this.batchSize = 250; // Smaller batch size
    this.totalProcessed = 0;
    this.statesMap = new Map();
  }

  parseNumber(value) {
    if (!value || value === 'NA' || value === '') return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  parseString(value) {
    if (!value || value === 'NA') return '';
    return value.toString().trim();
  }

  transformRow(row) {
    return {
      fin_year: this.parseString(row.fin_year),
      month: this.parseString(row.month),
      state_code: this.parseString(row.state_code),
      state_name: this.parseString(row.state_name),
      district_code: this.parseString(row.district_code),
      district_name: this.parseString(row.district_name),
      approved_labour_budget: this.parseNumber(row.Approved_Labour_Budget),
      average_wage_rate_per_day: this.parseNumber(row.Average_Wage_rate_per_day_per_person),
      average_days_of_employment: this.parseNumber(row.Average_days_of_employment_provided_per_Household),
      differently_abled_persons_worked: this.parseNumber(row.Differently_abled_persons_worked),
      material_and_skilled_wages: this.parseNumber(row.Material_and_skilled_Wages),
      number_of_completed_works: this.parseNumber(row.Number_of_Completed_Works),
      number_of_gps_with_nil_exp: this.parseNumber(row.Number_of_GPs_with_NIL_exp),
      number_of_ongoing_works: this.parseNumber(row.Number_of_Ongoing_Works),
      persondays_of_central_liability: this.parseNumber(row.Persondays_of_Central_Liability_so_far),
      sc_persondays: this.parseNumber(row.SC_persondays),
      sc_workers_against_active_workers: this.parseNumber(row.SC_workers_against_active_workers),
      st_persondays: this.parseNumber(row.ST_persondays),
      st_workers_against_active_workers: this.parseNumber(row.ST_workers_against_active_workers),
      total_adm_expenditure: this.parseNumber(row.Total_Adm_Expenditure),
      total_exp: this.parseNumber(row.Total_Exp),
      total_households_worked: this.parseNumber(row.Total_Households_Worked),
      total_individuals_worked: this.parseNumber(row.Total_Individuals_Worked),
      total_active_job_cards: this.parseNumber(row.Total_No_of_Active_Job_Cards),
      total_active_workers: this.parseNumber(row.Total_No_of_Active_Workers),
      total_hhs_completed_100_days: this.parseNumber(row.Total_No_of_HHs_completed_100_Days_of_Wage_Employment),
      total_job_cards_issued: this.parseNumber(row.Total_No_of_JobCards_issued),
      total_workers: this.parseNumber(row.Total_No_of_Workers),
      total_works_takenup: this.parseNumber(row.Total_No_of_Works_Takenup),
      wages: this.parseNumber(row.Wages),
      women_persondays: this.parseNumber(row.Women_Persondays),
      percent_category_b_works: this.parseNumber(row.percent_of_Category_B_Works),
      percent_expenditure_agriculture: this.parseNumber(row.percent_of_Expenditure_on_Agriculture_Allied_Works),
      percent_nrm_expenditure: this.parseNumber(row.percent_of_NRM_Expenditure),
      percentage_payments_within_15_days: this.parseNumber(row.percentage_payments_gererated_within_15_days),
      remarks: this.parseString(row.Remarks)
    };
  }

  async processBatch(batch) {
    try {
      await PerformanceData.insertMany(batch, { ordered: false });
      this.totalProcessed += batch.length;
      console.log(`✅ Total processed: ${this.totalProcessed} records`);
    } catch (error) {
      console.error('❌ Error inserting batch:', error.message);
      // Continue processing even if some records fail
    }
  }

  async loadData() {
    try {
      console.log('🌱 Starting optimized CSV data loading...');

      // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB');

      // Clear existing data
      await PerformanceData.deleteMany({});
      await StateDistrict.deleteMany({});
      console.log('🗑️ Cleared existing data');

      let currentBatch = [];

      return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(this.csvFilePath)
          .pipe(csv())
          .on('data', async (row) => {
            try {
              const transformedRow = this.transformRow(row);
              currentBatch.push(transformedRow);

              // Collect state-district mappings
              const stateName = transformedRow.state_name;
              const districtName = transformedRow.district_name;
              
              if (stateName && districtName) {
                if (!this.statesMap.has(stateName)) {
                  this.statesMap.set(stateName, {
                    state: stateName,
                    state_code: transformedRow.state_code,
                    districts: new Set()
                  });
                }
                this.statesMap.get(stateName).districts.add(districtName);
              }

              // Process batch when it reaches the limit
              if (currentBatch.length >= this.batchSize) {
                stream.pause(); // Pause reading
                await this.processBatch(currentBatch);
                currentBatch = []; // Clear the batch
                stream.resume(); // Resume reading
              }

            } catch (error) {
              console.error('❌ Error processing row:', error);
            }
          })
          .on('end', async () => {
            try {
              // Process remaining records
              if (currentBatch.length > 0) {
                await this.processBatch(currentBatch);
              }

              // Create state-district mappings
              const stateDistrictData = Array.from(this.statesMap.values()).map(state => ({
                state: state.state,
                state_code: state.state_code,
                districts: Array.from(state.districts).map(district => ({ name: district }))
              }));

              await StateDistrict.insertMany(stateDistrictData);
              console.log('✅ Inserted state-district mappings');

              console.log(`🎉 Successfully loaded ${this.totalProcessed} records from CSV`);
              console.log(`✅ Loaded ${stateDistrictData.length} states with districts`);

              resolve();
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (error) => {
            console.error('❌ Error reading CSV file:', error);
            reject(error);
          });
      });

    } catch (error) {
      console.error('❌ Error loading CSV data:', error);
      throw error;
    }
  }
}

// Run loader if called directly
if (require.main === module) {
  const loader = new OptimizedCSVLoader();
  loader.loadData()
    .then(() => {
      console.log('🎉 Data loading completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Data loading failed:', error);
      process.exit(1);
    });
}

module.exports = OptimizedCSVLoader;