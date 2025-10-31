require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');

// Quick CSV analysis without MongoDB
async function analyzeCSV() {
  return new Promise((resolve, reject) => {
    const csvPath = '../data/ee03643a-ee4c-48c2-ac30-9f2ff26ab722_d2992207337c9ad7a159ae473f77b7bc (1).csv';
    let rowCount = 0;
    const states = new Set();
    const districts = new Set();
    const yearMonths = new Set();
    
    console.log('📄 Analyzing CSV file...');
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        rowCount++;
        
        if (row.state_name) states.add(row.state_name);
        if (row.district_name) districts.add(row.district_name);
        if (row.fin_year && row.month) yearMonths.add(`${row.fin_year}-${row.month}`);
        
        if (rowCount % 20000 === 0) {
          console.log(`  📊 Processed ${rowCount} rows...`);
        }
      })
      .on('end', () => {
        console.log('\n📊 CSV Analysis Complete!');
        console.log('========================');
        console.log(`📈 Total Rows: ${rowCount.toLocaleString()}`);
        console.log(`🗺️  States: ${states.size}`);
        console.log(`📍 Districts: ${districts.size}`);
        console.log(`📅 Time Periods: ${yearMonths.size}`);
        
        console.log('\n🗺️  States List:');
        Array.from(states).sort().forEach(state => console.log(`   - ${state}`));
        
        console.log('\n📅 Time Coverage:');
        Array.from(yearMonths).sort().slice(0, 10).forEach(period => console.log(`   - ${period}`));
        if (yearMonths.size > 10) console.log(`   ... and ${yearMonths.size - 10} more periods`);
        
        resolve({
          totalRows: rowCount,
          states: states.size,
          districts: districts.size,
          timePeriods: yearMonths.size
        });
      })
      .on('error', reject);
  });
}

analyzeCSV().catch(console.error);