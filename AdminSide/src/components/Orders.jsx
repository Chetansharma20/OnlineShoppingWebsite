import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField, Typography, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [allOrders, setAllOrders] = useState([]);

  const [newStatus, setNewStatus] = useState('pending')
const [openDialog, setopenDialog] = useState(false)
const [SelectedOrder, setselectedOrder] = useState(null)
const[SelectOrderStatus, setSelectedOrder] = useState("")
const[filterOrder, setfilterOrder] = useState([])
const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event) => {
     setOpen(false);
  };
  
  let openUpdateDialog = (order) => {
    setopenDialog(true)
    setselectedOrder(order)
  }

  let closeUpdateDialog = () => {
    setopenDialog(false)
    setselectedOrder(null)
  }
  

  let updateOrders = async ()=>
  {
    try
    {
      let result = await axios.put("http://localhost:5000/api/updateorder",{orderstatus: newStatus, OrderId: SelectedOrder._id})
      console.log(result.data)
      closeUpdateDialog()

    }
    catch(error)
    {
      console.log(error)

    }
   
  }

 useEffect(() => {
    //define function
    let fetchOrders = async () => {
        let result = await axios.get("http://localhost:5000/api/fetchorders")
        console.log("DATR", result);
        setAllOrders(result.data)
    }


  

    //call functions
    fetchOrders()
}, [])
useEffect(()=>
  {
    if (!SelectOrderStatus) 
      {
        setfilterOrder(allOrders)
      
    }
    else
    {
    let filterdOrders = allOrders.filter((od)=> od.orderstatus == SelectOrderStatus)
    setfilterOrder(filterdOrders)
   
    console.log(filterdOrders)
    }
  },[SelectOrderStatus,allOrders])
let deleteOrder = async (OrderId) => {
  try {
    let result = await axios.delete("http://localhost:5000/api/deleteorder", 
      {
      data: { OrderId: OrderId }
    })
    console.log(result.data);
  } catch (error) {
    console.log(error);
  }
}
const handleChange = (e) => {
  setNewStatus(e.target.value);
};

  let navigate  = useNavigate()


  return (
    <>
    <Box sx={{
      padding: 4 } }>

        <Stack direction="row" spacing={2} sx={{m:2}}>
          {/* <Chip label="All" onClick={()=> setSelectedOrder("All")} variant='filled'/> */}
          <Chip label="Pending" onClick={()=> setSelectedOrder("pending")} variant='filled'/>
          <Chip label="Cancelled" onClick={()=> setSelectedOrder("cancelled")} variant='filled'/>
          <Chip label="Delivered" onClick={()=> setSelectedOrder("delivered")} variant='filled'/>
          <Chip label="Dispatch" onClick={()=> setSelectedOrder("dispatch")} variant='filled'/>
          <Chip label="Instransit" onClick={()=> setSelectedOrder("intransit")} variant='filled'/>



        </Stack>

<Grid container spacing={3} padding={2}>
      {filterOrder.map((order) => (
        <Grid
          item
          key={order._id}
          sm={12}
          md={6}
          lg={4}
        >
          <Card>
            {/* <CardMedia
              sx={{ height: 190 }}
              image="/order-placeholder.jpg" 
              title="Order Image"
            /> */}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}
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

            <CardActions>
              <Button
                onClick={() => navigate('/orderdetails', { state: order })}
                variant="contained"
                color="error"
              >
                Order Details
              </Button>
              <Button
              
                onClick={() => {openUpdateDialog(order), handleClick()}}
                variant="contained"
                color="error"
              >
                Update Order
              </Button>
              
              <Button
                onClick={() =>deleteOrder(order._id)}
                variant="contained"
                color="error"
              >
                Delete Order
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Dialog open={openDialog} onClose={closeUpdateDialog} >

<DialogTitle>
  Update Order
</DialogTitle>
<DialogContent>
<label>
        <input
          type="radio"
          value="pending"
          checked={newStatus === 'pending'  }
          onChange={handleChange}
        />
      Pending
      </label>

      <label>
        <input
          type="radio"
          value="cancelled"
          checked={newStatus === 'cancelled'}
          onChange={handleChange}
        />
        Cancelled
      </label>

      <label>
        <input
          type="radio"
          value="delivered"
          checked={newStatus === 'delivered'}
          onChange={handleChange}
        />
        Delivered
        <input
          type="radio"
          value="dispatch"
          checked={newStatus === 'dispatch'}
          onChange={handleChange}
        />
        Dispatch
        <input
          type="radio"
          value="in
          transit"
          checked={newStatus === 'intransit'}
          onChange={handleChange}
        />
        Instransit

      </label>


    {/* <TextField onChange={(e) => setNewStatus(e.target.value)} label="Enter Order Status" name="orderstatus" /> */}
 
</DialogContent>
<DialogActions>
  <Button onClick={() => updateOrders()} variant='contained' color='primary'>Submit</Button>
  <Button onClick={() => closeUpdateDialog()} variant='contained' color='error'>Close</Button>

</DialogActions>
</Dialog>
    </Box>
    
    <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Order Updated"
        // action={action}
      />
    </>
  )

}
export default Products