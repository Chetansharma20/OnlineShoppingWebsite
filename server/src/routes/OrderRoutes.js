import express from "express"
import { createOrder, deleteOrder, fetchAllOrders, fetchAllOrdersByUser, updateOrder } from "../Controllers/OrderControllers.js"

let OrderRoutes = express.Router()

OrderRoutes.get("/fetchorders", fetchAllOrders)
OrderRoutes.post("/createorder", createOrder)
OrderRoutes.put("/updateorder", updateOrder)
OrderRoutes.delete("/deleteorder", deleteOrder)
OrderRoutes.post("/fetchordersbyuser", fetchAllOrdersByUser)
export {OrderRoutes}