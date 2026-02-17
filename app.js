import express from "express";
const app = express();
const port = 5500;
 
import cors from 'cors'
app.use(cors())

// db conection

import dbConection from "./db/dbconfig.js";

// user routes  midleware file

import userRoutes from "./routes/userRoute.js";

// quesion routes  midleware file

import quesionRoutes from "./routes/quesionRoute.js";

// answer routes  midleware file

import answerRoutes from "./routes/answerRoute.js";

// authenthication middleware file
import authMiddleware from "./Middleware/authMiddleware.js";


// json midleware to extaract json data from request body
app.use(express.json());

// user routes  midleware file
app.use("/api/users/", userRoutes);

// question routes  midleware file
app.use("/api/questions/",authMiddleware, quesionRoutes);
// answer routes  midleware file
app.use("/api/answers/", authMiddleware,answerRoutes);




async function start() {
  try {
    const result = await dbConection.execute("select 'test' ",);
    console.log("database conction established");
    await app.listen(port);
    console.log(result)
    
  } catch (error) {
    console.log(error.message);
  }
  console.log(`server is running on port ${port}`);
  
}
start();














