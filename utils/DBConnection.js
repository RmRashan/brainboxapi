import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  // port: process.env.PORT,
  password: process.env.PASSWORD,
  database: process.env.DATABSE,
});

export default connection;
