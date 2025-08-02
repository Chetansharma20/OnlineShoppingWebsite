import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateTotal,
  decrementQty,
  incrementQty,
  removeItem,
  clearCart,
} from "../reduxwork/CartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Carts = () => {
  const { cartItems, cartTotalAmount } = useSelector((state) => state.cart);
  const { userData } = useSelector((state) => state.user);
// console.log(userData)
  const [open, setOpen] = useState(false);
  const dispatcher = useDispatch();
  const navigate = useNavigate();

  // Always recalculate total
  useEffect(() => {
    dispatcher(calculateTotal());
  }, [cartItems, dispatcher]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postOrder = async () => {
    if (!userData || !userData._id) {
      alert("You must be logged in to place an order.");
      navigate("/login");
      return;
    }

    let finalItems = cartItems.map((item) => ({
      prodId: item._id,
      qty: item.qty,
    }));

    const orderReqData = {
      orderTotalAmount: cartTotalAmount,
      userId: userData._id,
      orderItems: finalItems,
    };

    try {
      let result = await axios.post(
        "http://localhost:5000/api/createorder",
        orderReqData
      );
      console.log(result.data);
      dispatcher(clearCart());
      handleClick();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box>
        <Grid container spacing={3} padding={2}>
          {cartItems.map((prod) => (
            <Grid key={prod._id} item sm={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{prod.title}</Typography>
                  <Typography variant="h5">{prod.category}</Typography>
                  <Typography variant="h5">₹{prod.price}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    onClick={() => dispatcher(incrementQty(prod._id))}
                    color="success"
                  >
                    +
                  </Button>
                  {prod.qty}
                  <Button
                    variant="contained"
                    onClick={() => dispatcher(decrementQty(prod._id))}
                    color="success"
                  >
                    -
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => dispatcher(removeItem({ pId: prod._id }))}
                    color="error"
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography variant="h5" sx={{ mt: 2 }}>
        Total: ₹{cartTotalAmount}
      </Typography>

      <Button
        variant="contained"
        onClick={postOrder}
        disabled={!userData || !userData._id}
        sx={{ mt: 2 }}
      >
        Place Order
      </Button>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Order Placed"
      />
    </>
  );
};

export default Carts;
