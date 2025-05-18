import express from "express"
import { createReview, fetchReviews, fetchAllReviewWithPopulate } from "../Controllers/ReviewControllers.js"
let reviewRouter = express.Router()

reviewRouter.get("/fetchreviews", fetchAllReviewWithPopulate)
reviewRouter.post("/createreviews", createReview)
export {reviewRouter}
