import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Button, TextField, Divider } from "@mui/material";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  // Destructure cart data safely from navigation state
  const { cartItems = [], cartTotalAmount = 0, shippingCost = 0 } = location.state || {};

  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    district: "",
    pincode: ""
  });

  const [hasAddress, setHasAddress] = useState(false);

  useEffect(() => {
    if (userData?.userAddress) {
      setAddress(userData.userAddress);
      setHasAddress(true);
    }
  }, [userData]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleProceed = async () => {
    if (!hasAddress) {
      const { line1, city, district, pincode } = address;
      if (!line1 || !city || !district || !pincode) {
        alert("Please fill all required fields!");
        return;
      }

      try {
        await axios.put(
          "http://localhost:5000/api/updateuser",
          { userId: userData._id, userAddress: address },
          { withCredentials: true }
        );

        alert("Address saved! Proceeding to payment...");

        navigate("/payment", {
          state: {
            userData,
            address,
            cartItems,
            cartTotalAmount,
            shippingCost
          }
        });
      } catch (err) {
        console.error(err);
        alert("Failed to save address. Try again.");
      }
    } else {
      navigate("/payment", {
        state: {
          userData,
          address,
          cartItems,
          cartTotalAmount,
          shippingCost
        }
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: 3,
        border: "1px solid #ddd",
        borderRadius: 2
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Checkout
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Shipping Address
      </Typography>

      {hasAddress ? (
        <Box sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
          <Typography>{address.line1}</Typography>
          {address.line2 && <Typography>{address.line2}</Typography>}
          <Typography>
            {address.city}, {address.district} - {address.pincode}
          </Typography>
        </Box>
      ) : (
        <>
          <TextField
            fullWidth
            label="Address Line 1"
            name="line1"
            value={address.line1}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Address Line 2"
            name="line2"
            value={address.line2}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="City"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="District"
            name="district"
            value={address.district}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={address.pincode}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        Order Summary
      </Typography>

      <Box sx={{ mb: 2 }}>
        {cartItems.length === 0 ? (
          <Typography>No items in cart.</Typography>
        ) : (
          cartItems.map((item) => (
            <Box
              key={item._id || item.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1
              }}
            >
              <Typography>{item.name || item.title}</Typography>
              <Typography>
                {item.qty || item.quantity} × ₹{item.price.toFixed(2)}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Subtotal:</Typography>
        <Typography>₹{cartTotalAmount.toFixed(2)}</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Shipping:</Typography>
        <Typography>₹{shippingCost.toFixed(2)}</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", mb: 3 }}>
        <Typography>Total:</Typography>
        <Typography>₹{(cartTotalAmount + shippingCost).toFixed(2)}</Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={handleProceed}
      >
        Proceed to Payment
      </Button>
    </Box>
  );
};

export default Checkout;
