import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const Orders = () => {
  const { userData } = useSelector((state) => state.user);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.post(
          "http://localhost:5000/api/fetchordersbyuser",
          { userId: userData._id }
        );
        console.log(result);
        setAllOrders(result.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userData._id]); // include dependency to avoid lint warning

  return (
    <Box sx={{ padding: 4 }}>
      {allOrders.length === 0 ? (
        <Typography variant="h5" align="center">
          You have no orders.
        </Typography>
      ) : (
        <Grid container spacing={3} padding={2}>
          {allOrders.map((order) => (
            <Grid item key={order._id} sm={12} md={6} lg={4}>
              <Card>
               {order.orderItems.map((item, idx) => (
  <CardMedia
    key={idx}
    sx={{ height: 190 }}
    image={`http://localhost:5000/${item.prodId.prodimage}`}
  />
))}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <strong>Order Date:</strong>{" "}
                    {dayjs(order.orderDate).format("DD MMM YYYY, hh:mm A")}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    <strong>Status:</strong> {order.orderstatus}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    <strong>Total Amount:</strong> ₹{order.orderTotalAmount}
                  </Typography>
                  {/* <Typography variant="h6" gutterBottom>
                    <strong>User ID:</strong>{" "}
                    {order.userId?._id || order.userId || "N/A"}
                  </Typography> */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Orders;
