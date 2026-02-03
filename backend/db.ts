import postgres from 'postgres';

const connectionString = "postgresql://postgres.bgojfdawyydlkbzcxuey:whiteboard_opensoft1@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres";

// CRITICAL: Set prepare: false for Transaction Pooler (Port 6543)
const sql = postgres(connectionString, {
  prepare: false, 
});

sql`SELECT 1`
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });

export default sql;