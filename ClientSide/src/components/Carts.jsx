import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Snackbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { calculateTotal, decrementQty, incrementQty, removeItem } from '../reduxwork/CartSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { clearCart } from '../reduxwork/CartSlice'
const Carts = () => {
    let {cartItems, cartItemCount, cartTotalAmount} = useSelector((state)=> state.cart)
     
      const [open, setOpen] = useState(false);
    
      const handleClick = () => {
        setOpen(true);
      };
      const handleClose = (event) => {
         setOpen(false);
      };
      
    let dispatcher = useDispatch()
    {dispatcher(calculateTotal())}
    let navigate = useNavigate()
    let postOrder = async()=>
    {
        let finalItems =[]
        cartItems.forEach(item=>
        {
            finalItems.push({prodId: item._id, qty: item.qty})
        })
        console.log(finalItems)
        // let finalItems = {prodId: item._id, qty: item.qty})
        let orderReqData = {orderTotalAmount:cartTotalAmount, 
            userId:"67ee28170657921f54892762",
          orderItems:finalItems
        }
        try
    {
        let result = await axios.post("http://localhost:5000/api/createorder", orderReqData)
        console.log(result.data)
        dispatcher(clearCart())
        // alert("order placed successfully")

    }
    catch(error)
    {
        console.log(error)
    }
    }
  return (
    <>
<Box>

    <Grid container spacing={3} padding={2}>
        {
            cartItems.map((prod)=>
            {
                let pId = prod._id
                return(
                    <Grid size={{sm:12, md:6, lg:4}} item key={prod._id}>
                        <Card>
                            {/* <CardMedia sx={{height: 190}}>

                            </CardMedia> */}
                            <CardContent>


  <Typography variant='h5'>{prod.title}</Typography>
  <Typography variant='h5'>{prod.category}</Typography>
  <Typography variant='h5'>{prod.price}</Typography>
</CardContent>
<CardActions>
    <Button variant='contained' onClick={()=>
        {
 dispatcher(incrementQty(pId))
        }
    } color='success'>+</Button>
    {prod.qty}
    <Button variant='contained' onClick={()=>
        {
dispatcher(decrementQty(pId))
        }
    } color='success'>-</Button> <Button variant='contained' onClick={()=>
        {
dispatcher(removeItem(pId))
        }
    } color='success'>remove</Button>
    
</CardActions>
                        </Card>

                    </Grid>

                )
            })
        }


    </Grid>
</Box>

<Typography>Total:{cartTotalAmount}</Typography>
<Button variant='contained' onClick={()=>{ postOrder(), handleClick()}}>Place Order</Button> 
 
       <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={handleClose}
              message="Order Placed"
              // action={action}
            />   
    </>
  )
}

export default Carts