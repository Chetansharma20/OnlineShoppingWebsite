import mongoose from 'mongoose'
const ProductSchema = new mongoose.Schema({

    title: {
        type:String, 
        required: true,
        trim:true
    },

    description:{
        type:String,
        required:true,
        trim:true
    },
    brand: {
        type: String,
        required: true,
        trim:true,
    },

    category: {
        type: String,
        required: true,
        trim:true,
    },

   price:
    {
        type:Number,
        required:true
    },
    discountPercentage:{
        type:Number
    },
    prodimage:{type: String},
    isAvailable:
    {
        type:Boolean,
        default:false
    }

}, {timestamps:true});
export const Product = mongoose.model('product', ProductSchema);