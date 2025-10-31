#!/usr/bin/env node

/**
 * Database Seeding Script for MGNREGA Dashboard
 * Usage: 
 *   npm run seed              - Seed all data
 *   npm run seed:sample       - Seed sample data only
 *   npm run seed:states       - Seed states and districts only
 *   npm run seed:performance  - Seed performance data only
 */

require('dotenv').config();
const { DatabaseSeeder } = require('./realDataSeeder');

const args = process.argv.slice(2);
const command = args[0] || 'all';

async function main() {
  const seeder = new DatabaseSeeder();

  try {
    console.log('🚀 MGNREGA Database Seeding Tool');
    console.log('================================\n');

    switch (command) {
      case 'sample':
        console.log('📊 Seeding sample data (limited dataset for testing)...\n');
        await seeder.seedSampleData();
        break;

      case 'states':
        console.log('🗺️  Seeding states and districts only...\n');
        await seeder.connect();
        await seeder.seedStatesAndDistricts();
        break;

      case 'performance':
        console.log('📈 Seeding performance data only...\n');
        await seeder.connect();
        await seeder.seedPerformanceData();
        break;

      case 'all':
      default:
        console.log('🌍 Seeding complete database...\n');
        await seeder.seedAll();
        break;
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Check your MongoDB connection string (MONGO_URI)');
    console.error('   2. Ensure MongoDB is accessible and running');
    console.error('   3. Verify network connectivity if using cloud database');
    console.error('   4. Check if .env file exists and contains MONGO_URI');
    
    process.exit(1);
  } finally {
    await seeder.disconnect();
  }
}

// Handle cleanup on process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Seeding interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Seeding terminated');
  process.exit(0);
});

// Show help
if (args.includes('--help') || args.includes('-h')) {
  console.log('MGNREGA Database Seeding Tool');
  console.log('=============================\n');
  console.log('Usage: node seedDatabase.js [command]\n');
  console.log('Commands:');
  console.log('  all (default)  - Seed complete database with all states and districts');
  console.log('  sample         - Seed limited data for testing (2 states, 5 districts each)');
  console.log('  states         - Seed only states and districts data');
  console.log('  performance    - Seed only performance data\n');
  console.log('Environment Variables:');
  console.log('  MONGO_URI      - MongoDB connection string (required)\n');
  console.log('Examples:');
  console.log('  node seedDatabase.js all');
  console.log('  node seedDatabase.js sample');
  console.log('  npm run seed');
  console.log('  npm run seed:sample');
  process.exit(0);
}

main();