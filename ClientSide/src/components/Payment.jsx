import React from "react";
import axios from "axios";
import { Button, Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

const Payment = ({ onSuccess }) => {
  const location = useLocation();
  const { cartItems = [], cartTotalAmount = 0 , shippingCost = 0, userData = {}, address = {} } = location.state || {};

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) return alert("Cart is empty");

    const res = await loadRazorpayScript();
    if (!res) return alert("Razorpay SDK failed to load");

    try {
      // Create Razorpay order
      const { data: razorpayOrder } = await axios.post(
        "http://localhost:5000/api/createpayment",
        {
          amount: (cartTotalAmount + shippingCost) * 100,
          currency: "INR"
        }
      );

      const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // public key only
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "My E-Commerce",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/verifypayment",
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userId: userData._id,
                orderItems: cartItems.map(item => ({ prodId: item._id, qty: item.qty })),
                orderTotalAmount: cartTotalAmount + shippingCost || 0,
                shippingAddress: address
              }
            );

            if (verifyRes.data.success) {
              alert("Payment successful!");
              if (onSuccess) onSuccess();
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            console.error(err);
            alert("Error verifying payment");
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.phone || ""
        },
        theme: { color: "#528FF0" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error creating payment order");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Payment
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Shipping To: {address.line1}, {address.city}, {address.district} - {address.pincode}
      </Typography>

      <Typography sx={{ mb: 3 }}>
        Total Amount: ₹{(cartTotalAmount + shippingCost).toFixed(2)}
      </Typography>

      <Button variant="contained" fullWidth size="large" onClick={handlePayment}>
        Pay ₹{(cartTotalAmount + shippingCost).toFixed(2)}
      </Button>
    </Box>
  );
};

export default Payment;
