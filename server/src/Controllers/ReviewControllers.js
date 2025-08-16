import mongoose from "mongoose";
import { Review } from "../Models/ReviewSchema.js";

let createReview = async (req,res)=>
{
    let reqData = req.body
    console.log(reqData)
    try
    {
        let result = await Review.create(reqData)
        res.status(200).json({
            data:result,
            message: "review added successfully"

        })
    }
    catch(error)
    {
        res.status(500).json(error)
    }
}

const createReviewbyuser = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    if (!userId || !productId || !rating) {
      return res.status(400).json({ message: "userId, productId, and rating are required" });
    }

    const newReview = await Review.create({
      userId,
      productId,
      rating,
      comment
    });

    res.status(200).json({
      data: newReview,
      message: "Review added successfully"
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

let fetchReviews = async(req,res)=>
{
    try{

        let result = await Review.find()
        res.status(200).json(result)

    }  catch (error)
    {
        res.status(500).json(error)
    }
}

const fetchReviewsbyProduct = async (req, res) => {
  const { productId } = req.body;

  try {
    const reviews = await Review.find({ productId });
    res.status(200).json({
      data: reviews,
      result: " review fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching reviews by product:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAllReviewWithPopulate = async (req, res) => {
  try {
    const result = await Review.find()
      .populate("productId")
      .populate("userId", "userName userEmail");

    res.status(200).json(result);
  } catch (error) {

    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
let fetchAvgReview = async(req,res)=>
{
  try
  {
    let {productId} = req.body
    const result = await Review.aggregate([
      {
        $match:{productId: new mongoose.Types.ObjectId(productId) }
      },
      {
        $group:{
          _id:"$productId",
          avgRating:{$avg:"$rating"},
          count:{$sum:1}
        }
      }
    ])
    
    if (result.length === 0) {
      return res.status(200).json({ avgRating: 0, count: 0 });
    }

    res.status(200).json({
      avgRating: result[0].avgRating.toFixed(1),
      count: result[0].count,
      
      message: "Average review fetched successfully"

    })
  }
  catch (error) {
    console.error("Error fetching average review:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {createReview, fetchReviews, fetchAllReviewWithPopulate, createReviewbyuser, fetchReviewsbyProduct, fetchAvgReview}
