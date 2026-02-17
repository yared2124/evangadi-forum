import dotenv from "dotenv";
dotenv.config();
import mysql2 from "mysql2";

const dbConection = mysql2.createPool({
  user: process.env.USER,
  database:process.env.DATABASE,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  connectionLimit: 10,
});
dbConection.execute("select 'test' ", (error, result) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log(result);

   
  }
});

export default dbConection.promise();
