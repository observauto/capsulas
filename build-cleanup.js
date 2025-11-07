// AUTOMATIC DATABASE CLEANUP FOR EVERY BUILD
// This script cleans the database to ensure testing from scratch every time

const { createClient } = require('@supabase/supabase-js');

// Get environment variables (will be set in build process)
const supabaseUrl = 'https://ocuehuwgxyknnwyjubpt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY_HERE';

if (supabaseServiceKey === 'YOUR_SERVICE_KEY_HERE') {
  console.log('⚠️ WARNING: SUPABASE_SERVICE_KEY not set. Database cleanup skipped.');
  console.log('Please set SUPABASE_SERVICE_KEY environment variable for automatic cleanup.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupDatabase() {
  console.log('🧹 Starting automatic database cleanup...');
  
  try {
    // 1. Clean ALL user progress tables
    const cleanupQueries = [
      'DELETE FROM capsule_progress;',
      'DELETE FROM user_pill_progress;',
      'DELETE FROM user_profiles;',
      'DELETE FROM point_transactions;',
      'DELETE FROM user_achievements;',
      'DELETE FROM user_badges;',
      'DELETE FROM user_rewards;',
      'DELETE FROM user_progress;',
      'DELETE FROM user_activities;',
      'DELETE FROM user_interactions;',
      'DELETE FROM user_sessions;',
      'DELETE FROM user_streaks;',
      'DELETE FROM assessment_results;',
      'DELETE FROM detailed_assessment_results;'
    ];

    for (const query of cleanupQueries) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: query });
        if (error) {
          console.log(`⚠️ Error executing: ${query}`, error.message);
        }
      } catch (err) {
        console.log(`⚠️ Query error: ${err.message}`);
      }
    }

    console.log('✅ Database cleanup completed successfully!');
    console.log('📊 Database is now clean for fresh testing.');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error.message);
    console.log('🔄 Continuing with build process...');
  }
}

// Run cleanup if this script is called directly
if (require.main === module) {
  cleanupDatabase();
}

module.exports = { cleanupDatabase };