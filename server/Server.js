import bodyParser from 'body-parser'
import express from 'express'
import { connectToDatabase } from './src/DB/dbConnection.js'
import { userRouter } from './src/routes/UseRouter.js'
import { productRouter } from './src/routes/ProductRoutes.js'
import { reviewRouter } from './src/routes/ReviewRouter.js'
import { OrderRoutes } from './src/routes/OrderRoutes.js'
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();

let Server = express()
Server.use(express.json());
const PORT = process.env.PORT || 5000;
Server.use(bodyParser.json())
Server.use(cors())
// call DB Connection function
connectToDatabase()
Server.get("/", (req,res)=>
{
    res.send("Hello guys...")
})

Server.use("/api",userRouter)
Server.use("/api", productRouter)
Server.use("/api", reviewRouter)
Server.use("/api", OrderRoutes)
Server.use("/Uploadimages",express.static("Uploadimages"))
Server.listen(PORT, ()=>
{
    console.log(" Server running on http://localhost:${PORT}")
})