import bodyParser from 'body-parser'
import express from 'express'
import { connectToDatabase } from './src/DB/dbConnection.js'
import { userRouter } from './src/routes/UseRouter.js'
import { productRouter } from './src/routes/ProductRoutes.js'
import { reviewRouter } from './src/routes/ReviewRouter.js'
import { OrderRoutes } from './src/routes/OrderRoutes.js'
import cors from "cors"
let Server = express()
Server.use(express.json());

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
Server.listen(5000, ()=>
{
    console.log("server started")
})