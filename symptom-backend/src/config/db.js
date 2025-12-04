import dotenv from "dotenv";
dotenv.config(); // Load environment variables FIRST

import pkg from "pg";
const { Pool } = pkg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default db;
