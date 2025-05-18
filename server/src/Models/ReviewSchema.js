import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    rating:{
        type: Number,
        required:true,
        min:1,
        max:5
    },
    Comment:
    {
        type: String,
        required:true,
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
        ref: "user"
    }
}, {timestamps:true});

export const Review = mongoose.model('review', ReviewSchema);