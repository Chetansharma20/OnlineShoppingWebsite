import bodyParser from 'body-parser'
import express from 'express'
import { connectToDatabase } from './src/DB/dbConnection.js'
import { userRouter } from './src/routes/UseRouter.js'
import { productRouter } from './src/routes/ProductRoutes.js'
import { reviewRouter } from './src/routes/ReviewRouter.js'
import { OrderRoutes } from './src/routes/OrderRoutes.js'
import cors from "cors"
import { wishRouter } from './src/routes/wishlistroutes.js'
// import authRoutes from './src/routes/AuthRoutes.js';

// Other middlewares like express-session, passport.initialize(), passport.session()



// import { jwtrouter } from './src/routes/jwtroutes.js'
import dotenv from "dotenv";
import passport from 'passport';
import session from 'express-session'
import { router } from './src/routes/passportroute.js'
import { connectpassport } from './src/Controllers/passportController.js'
import RazorpayRoutes from './src/routes/PaymentRoutes.js'

dotenv.config();

let Server = express()

Server.use(express.json());

Server.use(bodyParser.json())

Server.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true
}));

Server.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,

}));
// Server.use(passport.authenticate('session'));
connectpassport()
Server.use(passport.initialize());
Server.use(passport.session());

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
Server.use("/api", wishRouter)
Server.use("/api", router)
Server.use("/api", RazorpayRoutes)
// Server.use("/api",jwtrouter)
Server.use("/Uploadimages",express.static("Uploadimages"))
Server.listen(5000, ()=>
{
    console.log("server started")
})