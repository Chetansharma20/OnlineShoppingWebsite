import express from "express"
import { createReview, fetchReviews, fetchAllReviewWithPopulate, createReviewbyuser, fetchReviewsbyProduct, fetchAvgReview } from "../Controllers/ReviewControllers.js"
let reviewRouter = express.Router()

reviewRouter.get("/fetchreviews", fetchAllReviewWithPopulate)
reviewRouter.post("/createreviews", createReview)

reviewRouter.post("/fetchreviewsbyproduct", fetchReviewsbyProduct)
reviewRouter.post("/createreviewsbyuser", createReviewbyuser)
reviewRouter.post("/fetchavgreviews", fetchAvgReview)

export {reviewRouter}
