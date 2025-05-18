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


let fetchAllReviewWithPopulate = async (req,res)=>
{
    try
    {
        let result = await Review.find()
        .populate("productId")
        .populate("userId","userName userEmail")
        res.status(200).json(result)

    } catch(error)
    {
        res.status(500).json(error)
    }
}

export {createReview, fetchReviews, fetchAllReviewWithPopulate}
