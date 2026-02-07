import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env file');
}

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