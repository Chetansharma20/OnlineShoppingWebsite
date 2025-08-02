import { Product } from "../Models/ProductSchema.js";

let createProduct = async(req, res)=>
{
    let reqData = req.body
    console.log(reqData)
    try
    {
let filepath = req.file.path.replace("\\","/")

        let result = await Product.create({...req.body, prodimage:filepath})
      
        res.status(200).json({
            data:result,
            message:"Product Added Successfully"

        })
    } 
    catch(error)
    { console.log(error)
        res.status(500).json(error)
       
    }
}
let fetchAllProducts = async(req,res)=>
{
    try
    {
        let result = await Product.find()
        res.status(200).json(result)

    } catch (error)
    {
        res.status(500).json(error)
    }
}
 let deleteProduct = async (req, res) => {
        try {
            let { prodId } = req.body
            let result = await Product.findByIdAndDelete({ _id: prodId })
            res.status(200).json({
                message: "Product Deleted"
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
 let updateProduct = async (req, res) => {
        try {
            let { prodId, price, isAvailable } = req.body
            let result = await Product.findByIdAndUpdate({ _id: prodId }, {
                price:price,
                isAvailable:isAvailable
            }, { new: true })
            res.status(200).json({
                data: result,
                message: "Product price and availability updated successfully"
            })
        } catch (error) {
            res.status(500).json(error)
        }
    } 


export {createProduct, fetchAllProducts, deleteProduct, updateProduct}