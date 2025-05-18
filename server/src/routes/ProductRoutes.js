import express from "express"
import { createProduct, deleteProduct, fetchAllProducts, updateProduct } from "../Controllers/ProductControllers.js"
import { upload } from "../MiddleWare/FileuploadMiddleware.js"
// import { upload } from "../MiddleWare/FileuploadMiddleware.js"
let productRouter = express.Router()

productRouter.get("/fetchproducts", fetchAllProducts)
productRouter.post("/createproduct", upload.single("prodimage"), createProduct)
productRouter.delete ("/deleteproduct", deleteProduct)
productRouter.put("/updateproduct", updateProduct)
export{productRouter}