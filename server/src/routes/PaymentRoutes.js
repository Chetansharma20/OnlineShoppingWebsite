import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../Controllers/PaymentIntegration.js';


const RazorpayRoutes = express.Router();

// Create a Razorpay order
RazorpayRoutes.post("/createpayment", createRazorpayOrder);

// Verify Razorpay payment
RazorpayRoutes.post("/verifypayment", verifyRazorpayPayment);

export default RazorpayRoutes;
