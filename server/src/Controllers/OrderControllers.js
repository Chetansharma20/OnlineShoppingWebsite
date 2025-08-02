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
        console.log(error)
        res.status(500).json(error)
    }
}
 let fetchAllOrdersByUser = async(req,res)=>
{
    console.log(req.body)
    let {userId} = req.body

    try
    {
        
        let result = await Order.find({userId:userId})
        .populate("userId")
        .populate("orderItems.prodId")
        res.status(200).json(
            {
                data:result,
                message:"orders fetched successfully"
            }
        )
    } catch (error) 
    {
        console.log(error)
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
    //  let deleteOrder = async (req, res) => {
    //          try {
    //              let { OrderId } = req.body
    //              let result = await Order.findByIdAndDelete({ _id: OrderId })
    //              res.status(200).json({
                    
    //                  message: "Order Deleted"
    //              })
    //          } catch (error) {
    //              res.status(500).json(error)
    //          }
    //      }  
       
let deleteOrder = async (req, res) => {
  try {
    let { OrderId } = req.body; // or req.params.OrderId

    // 🚨 Always check!
    if (!OrderId) {
      return res.status(400).json({
        message: "OrderId is required."
      });
    }

    let order = await Order.findById(OrderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found."
      });
    }

    await Order.findByIdAndDelete(OrderId);

    res.status(200).json({
      message: "Order deleted successfully.",
      data: order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error."
    });
  }
};

export {createOrder, fetchAllOrders, updateOrder, deleteOrder, fetchAllOrdersByUser}