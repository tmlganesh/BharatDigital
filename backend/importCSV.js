const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { StateDistrict, PerformanceData } = require('./models');

class CSVDataImporter {
  constructor() {
    this.csvFilePath = path.join(__dirname, '..', 'data', 'ee03643a-ee4c-48c2-ac30-9f2ff26ab722_d2992207337c9ad7a159ae473f77b7bc (1).csv');
    this.batchSize = 1000; // Process in batches to avoid memory issues
    this.totalProcessed = 0;
    this.statesMap = new Map();
    this.errors = [];
  }

  async connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB for CSV import');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      throw error;
    }
  }

  // Map CSV columns to our schema
  mapCSVToSchema(csvRow) {
    try {
      return {
        fin_year: csvRow.fin_year || '',
        month: csvRow.month || '',
        state_code: csvRow.state_code || '',
        state_name: csvRow.state_name || '',
        district_code: csvRow.district_code || '',
        district_name: csvRow.district_name || '',
        approved_labour_budget: parseFloat(csvRow.Approved_Labour_Budget) || 0,
        average_wage_rate_per_day: parseFloat(csvRow.Average_Wage_rate_per_day_per_person) || 0,
        average_days_of_employment: parseFloat(csvRow.Average_days_of_employment_provided_per_Household) || 0,
        differently_abled_persons_worked: parseInt(csvRow.Differently_abled_persons_worked) || 0,
        material_and_skilled_wages: parseFloat(csvRow.Material_and_skilled_Wages) || 0,
        number_of_completed_works: parseInt(csvRow.Number_of_Completed_Works) || 0,
        number_of_gps_with_nil_exp: parseInt(csvRow.Number_of_GPs_with_NIL_exp) || 0,
        number_of_ongoing_works: parseInt(csvRow.Number_of_Ongoing_Works) || 0,
        persondays_of_central_liability: parseInt(csvRow.Persondays_of_Central_Liability_so_far) || 0,
        sc_persondays: parseInt(csvRow.SC_persondays) || 0,
        sc_workers_against_active_workers: parseInt(csvRow.SC_workers_against_active_workers) || 0,
        st_persondays: parseInt(csvRow.ST_persondays) || 0,
        st_workers_against_active_workers: parseInt(csvRow.ST_workers_against_active_workers) || 0,
        total_adm_expenditure: parseFloat(csvRow.Total_Adm_Expenditure) || 0,
        total_exp: parseFloat(csvRow.Total_Exp) || 0,
        total_households_worked: parseInt(csvRow.Total_Households_Worked) || 0,
        total_individuals_worked: parseInt(csvRow.Total_Individuals_Worked) || 0,
        total_active_job_cards: parseInt(csvRow.Total_No_of_Active_Job_Cards) || 0,
        total_active_workers: parseInt(csvRow.Total_No_of_Active_Workers) || 0,
        total_hhs_completed_100_days: parseInt(csvRow.Total_No_of_HHs_completed_100_Days_of_Wage_Employment) || 0,
        total_job_cards_issued: parseInt(csvRow.Total_No_of_JobCards_issued) || 0,
        total_workers: parseInt(csvRow.Total_No_of_Workers) || 0,
        total_works_takenup: parseInt(csvRow.Total_No_of_Works_Takenup) || 0,
        wages: parseFloat(csvRow.Wages) || 0,
        women_persondays: parseInt(csvRow.Women_Persondays) || 0,
        percent_category_b_works: parseFloat(csvRow.percent_of_Category_B_Works) || 0,
        percent_expenditure_agriculture: parseFloat(csvRow.percent_of_Expenditure_on_Agriculture_Allied_Works) || 0,
        percent_nrm_expenditure: parseFloat(csvRow.percent_of_NRM_Expenditure) || 0,
        percentage_payments_within_15_days: parseFloat(csvRow.percentage_payments_gererated_within_15_days) || 0,
        remarks: csvRow.Remarks || '',
        // Calculated compatibility fields
        persondays_generated: parseInt(csvRow.Persondays_of_Central_Liability_so_far) || 0,
        avg_wage_per_day: parseFloat(csvRow.Average_Wage_rate_per_day_per_person) || 0,
        total_expenditure: parseFloat(csvRow.Total_Exp) || 0,
        ongoing_works: parseInt(csvRow.Number_of_Ongoing_Works) || 0
      };
    } catch (error) {
      console.error('Error mapping CSV row:', error.message, csvRow);
      return null;
    }
  }

  // Extract unique states and districts from CSV
  extractStatesDistricts(performanceData) {
    performanceData.forEach(record => {
      const stateKey = record.state_name;
      if (!this.statesMap.has(stateKey)) {
        this.statesMap.set(stateKey, {
          state: record.state_name,
          state_code: record.state_code,
          districts: new Set()
        });
      }
      
      this.statesMap.get(stateKey).districts.add(JSON.stringify({
        name: record.district_name,
        code: record.district_code
      }));
    });
  }

  async clearExistingData() {
    console.log('🗑️  Clearing existing data...');
    await StateDistrict.deleteMany({});
    await PerformanceData.deleteMany({});
    console.log('✅ Existing data cleared');
  }

  async importStatesDistricts() {
    console.log('🗺️  Importing states and districts...');
    
    const statesData = Array.from(this.statesMap.values()).map(state => ({
      state: state.state,
      state_code: state.state_code,
      districts: Array.from(state.districts).map(d => JSON.parse(d))
    }));

    await StateDistrict.insertMany(statesData);
    console.log(`✅ Imported ${statesData.length} states with districts`);
  }

  async importPerformanceData(performanceData) {
    console.log(`📊 Importing ${performanceData.length} performance records...`);
    
    // Process in batches to avoid memory issues
    const batches = [];
    for (let i = 0; i < performanceData.length; i += this.batchSize) {
      batches.push(performanceData.slice(i, i + this.batchSize));
    }

    for (let i = 0; i < batches.length; i++) {
      try {
        await PerformanceData.insertMany(batches[i], { ordered: false });
        this.totalProcessed += batches[i].length;
        console.log(`  📈 Batch ${i + 1}/${batches.length} completed (${this.totalProcessed} total records processed)`);
      } catch (error) {
        console.warn(`  ⚠️  Some records in batch ${i + 1} had issues:`, error.message);
        // Continue with other batches even if some fail
      }
    }
  }

  async importCSV() {
    return new Promise((resolve, reject) => {
      const performanceData = [];
      let rowCount = 0;

      console.log('📄 Reading CSV file...');
      console.log(`📍 File: ${this.csvFilePath}`);

      fs.createReadStream(this.csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          rowCount++;
          
          // Skip invalid rows
          if (!row.state_name || !row.district_name) {
            return;
          }

          const mappedData = this.mapCSVToSchema(row);
          if (mappedData) {
            performanceData.push(mappedData);
          }

          // Show progress every 10k records
          if (rowCount % 10000 === 0) {
            console.log(`  📊 Processed ${rowCount} CSV rows...`);
          }
        })
        .on('end', async () => {
          try {
            console.log(`\n✅ CSV parsing completed!`);
            console.log(`📊 Total CSV rows: ${rowCount}`);
            console.log(`📊 Valid records: ${performanceData.length}`);

            // Extract states and districts
            this.extractStatesDistricts(performanceData);
            console.log(`🗺️  Found ${this.statesMap.size} unique states`);

            // Clear existing data
            await this.clearExistingData();

            // Import states and districts
            await this.importStatesDistricts();

            // Import performance data
            await this.importPerformanceData(performanceData);

            resolve({
              totalRows: rowCount,
              validRecords: performanceData.length,
              states: this.statesMap.size,
              recordsImported: this.totalProcessed
            });

          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      console.log('👋 Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting:', error.message);
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 MGNREGA CSV Data Import Tool');
  console.log('===============================\n');

  const importer = new CSVDataImporter();

  try {
    // Check if CSV file exists
    if (!fs.existsSync(importer.csvFilePath)) {
      throw new Error(`CSV file not found: ${importer.csvFilePath}`);
    }

    console.log('📂 CSV file found, starting import...\n');

    await importer.connect();
    const result = await importer.importCSV();

    console.log('\n🎉 CSV Import Completed Successfully!');
    console.log('=====================================');
    console.log(`📊 Total CSV Rows: ${result.totalRows.toLocaleString()}`);
    console.log(`✅ Valid Records: ${result.validRecords.toLocaleString()}`);
    console.log(`🗺️  States Imported: ${result.states}`);
    console.log(`📈 Performance Records: ${result.recordsImported.toLocaleString()}`);

  } catch (error) {
    console.error('\n❌ CSV Import Failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Ensure CSV file exists in data/ directory');
    console.error('   2. Check MongoDB connection (MONGO_URI)');
    console.error('   3. Verify CSV file format and permissions');
    process.exit(1);
  } finally {
    await importer.disconnect();
  }
}

// Handle cleanup
process.on('SIGINT', async () => {
  console.log('\n🛑 Import interrupted by user');
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = { CSVDataImporter };