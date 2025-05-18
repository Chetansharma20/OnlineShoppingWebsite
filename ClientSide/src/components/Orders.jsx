import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';

const Orders = () => {
  const[allOrders, setAllOrders] = useState([]);

  useEffect(()=>
  {
    let fetchOrders = async()=>
  {
    let result = await axios.get("http://localhost:5000/api/fetchorders")
    console.log(result)
    setAllOrders(result.data)
  }
  fetchOrders()
  },[])
  // let navigate = useNavigate()
  return (
    <>
     <Box sx={{
      padding: 4 }}>

<Grid container spacing={3} padding={2}>
      {allOrders.map((order) => (
        <Grid
          item
          key={order._id}
          sm={12}
          md={6}
          lg={4}
        >
          <Card>
          <CardMedia
                      sx={{
                        height: 190
                      }}
                    image={`http://localhost:5000/${order.prodimage}`}
                    />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {/* <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()} */}
                <strong>Order Date:</strong> {dayjs(new Date(order.orderDate)).toLocaleString()}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>Status:</strong> {order.orderstatus}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>Total Amount:</strong> ₹{order.orderTotalAmount}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>User ID:</strong> {order.userId}
              </Typography>
            </CardContent>

            </Card>
        </Grid>
      ))}
    </Grid>
    

    </Box>
    
   
    
    
    
    </>
  )
}

export default Orders