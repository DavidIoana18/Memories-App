import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function connectDB() {
    try {
      await db.connect(); // wait for the connection to be established
      console.log('PostgreSQL database connection successful');
    } catch (err) {
      console.error('Error connecting to PostgreSQL database', err);
    }
  }
  
  connectDB();

  export default db; 