import { Box, Button, Card, CardContent, CardMedia, Grid, Typography, CardActions, Snackbar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { addItem } from '../reduxwork/CartSlice';
import { useDispatch } from 'react-redux';
// import CloseIcon from '@mui/icons-material/Close';

const Products = () => {
  const[allProducts, setAllProducts] = useState([])
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event) => {
     setOpen(false);
  };
  

  useEffect(()=>
  {
    let fetchProducts = async()=>
    {
      let result = await axios.get("http://localhost:5000/api/fetchproducts")
      console.log(result)
      setAllProducts(result.data)
    }
    fetchProducts()
  },[])
  let dispatcher = useDispatch()

  return (
    <>
    
    <Box sx={{
        padding: 4
      }}>

        <Grid container spacing={3} padding={2}>
          {
            allProducts.map((prod) => {
              return (
                <Grid size={{
                  sm: 6,
                  md: 4,
                 
                  xs: 12
                }} item key={prod._id}>
                  <Card>
                    <CardMedia
                      sx={{
                        height: 190
                      }}
                    image={`http://localhost:5000/${prod.prodimage}`}
                    />
                    <CardContent>
                      <Typography variant='h5'>{prod.title}</Typography>

                      <Typography variant='h5'>{prod.category}</Typography>
                      <Typography variant='h5' color={prod.price > 15 ? "error" : "primary"}>{prod.price}</Typography>
                      <Typography variant='h5'>{prod.brand}</Typography>
                      {/* <Typography variant='h5'>{prod.prodimage}</Typography> */}
                    </CardContent>
                    <CardActions>
                      <Button  variant='contained' color='error' type='submit' onClick={()=> {dispatcher(addItem(prod)),handleClick()}}>Add to Cart</Button>
                        {/* // alert("added"), */}
                     
                    </CardActions>
                  </Card>
                </Grid>
              )
            }

            )
          }
        </Grid>
        <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Product Added to cart"
        // action={action}
      />
      </Box>
      
      {/* <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
     */}
    </>
  )
}

export default Products