import {  Typography,  Card, Grid, CardContent} from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom'
// import Grid2 from '@mui/maerial/Unstable_Grid2';

const OrderDetails = () => {

    let orderData = useLocation().state
  return (
    <>

<Typography variant='h4'>Details</Typography>
     

<Grid container spacing={3} padding={3} >
{
  orderData.orderItems.map((ord)=>
    {
        return(
            <Grid size={{
                lg:3
}} item key={ord.prodId} lg={3}>
                <Card>

            <CardContent>


                {/* <Typography variant='inherit'>ProductId:{ord.prodId.title}</Typography>
                <Typography variant='inherit'>ProductId:{ord.prodId.description}</Typography>
                <Typography variant='inherit'>Quantity:{ord.qty}</Typography>
                */}
                
                <Typography variant='inherit'>Product Title: {ord.prodId?.title}</Typography>
              <Typography variant='inherit'>Description: {ord.prodId?.description}</Typography>
              <Typography variant='inherit'>Quantity: {ord.qty}</Typography>


            </CardContent>
                  
                </Card>
                </Grid>
        )
    })
}



</Grid>





    </>
  )
}

export default OrderDetails