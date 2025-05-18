import mongoose, { mongo } from "mongoose";

let OrderSchema = mongoose.Schema({
    orderDate: {type: Date, default: Date.now},
    orderstatus: {type:String, default: "pending" },
    orderTotalAmount: {type:Number},
    orderItems:[{
        prodId: {type: mongoose.Schema.Types.ObjectId, ref: "product"},
        qty: {type: Number}

    }],
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"user"}
})

export const Order = mongoose.model("order", OrderSchema)