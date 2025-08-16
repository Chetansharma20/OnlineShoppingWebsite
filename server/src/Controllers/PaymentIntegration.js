
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
dotenv.config();
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
    const { amount, currency } = req.body; // amount in paise

    try {
        const order = await razorpay.orders.create({
            amount,
            currency: currency || 'INR',
            payment_capture: 1
        });
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating Razorpay order', error: err });
    }
};

// Verify Razorpay payment
const verifyRazorpayPayment = (req, res) => {
    const { order_id, payment_id, signature } = req.body;

    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${order_id}|${payment_id}`)
        .digest('hex');

    if (generated_signature === signature) {
        res.json({ success: true, message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
};

// Export all functions at the end
export {
    createRazorpayOrder,
    verifyRazorpayPayment
};
