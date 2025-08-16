import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    rating:{
        type: Number,
        required:false,
        min:1,
        max:5
    },
    comment:
    {
        type: String,
        required:false,
        trim: true
    },
    date:{
        type:Date,
        required: true,
        default: Date.now
    },

    productId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps:true});

export const Review = mongoose.model('review', ReviewSchema);