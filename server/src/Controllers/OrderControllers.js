import { Order } from "../Models/OrderSchma.js";

let createOrder = async(req,res)=>
{
    let reqData = req.body
    console.log(reqData);
    try{
        let result = await Order.create(reqData)
        res.status(200).json({
            data: result, 
            message:"Order Placed Successfully"
        })
    } catch (error)
    {
        res.status(500).json(error)
    }
}

let fetchAllOrders = async(req,res)=>
{
    try
    {
        let result = await Order.find()
        .populate("userId")
        .populate("orderItems.prodId")
        res.status(200).json(result)
    } catch (error) 
    {
        res.status(500).json(error)
    }
}
 
   let updateOrder = async (req, res) => {
           try {
               let { OrderId, orderstatus } = req.body
               let result = await Order.findByIdAndUpdate({ _id: OrderId}, 
                {
                   orderstatus : orderstatus},
                    { new: true })
                    .populate("userId")
                    .populate("orderItems.prodId")
                    
               res.status(200).json({
                   data: result,
                   message: "Order status updated"
               })
           } catch (error) {

               res.status(500).json(error)
           }
       } 
     let deleteOrder = async (req, res) => {
             try {
                 let { OrderId } = req.body
                 let result = await Order.findByIdAndDelete({ _id: OrderId })
                 res.status(200).json({
                     message: "User Deleted"
                 }).populate("userId")
                 .populate("orderItems.prodId")
             } catch (error) {
                 res.status(500).json(error)
             }
         }  
       

export {createOrder, fetchAllOrders, updateOrder, deleteOrder}