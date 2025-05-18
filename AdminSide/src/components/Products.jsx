import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [SelectedProd, setselectedProd] = useState(null)
  const [openDialog, setopenDialog] = useState(false)
  const [newPrice, setnewPrice] = useState(0)
 
  let openUpdateDialog = (prod) => {
    setopenDialog(true)
    setselectedProd(prod)
  }

  let closeUpdateDialog = () => {
    setopenDialog(false)
    setselectedProd(null)
  }
 let updateprodPrice = async () => {
    try {
      let result = await axios.put("http://localhost:5000/api/updateproduct", { price: newPrice, prodId: SelectedProd._id })

      console.log(result.data)
      closeUpdateDialog()

    } catch (error) {
      console.log(error)
    }
    //  windows.location.reload();
  }

  useEffect(() => {
    //define function
    let fetchProducts = async () => {
      let result = await axios.get("http://localhost:5000/api/fetchproducts")
      console.log("DATR", result);
      setAllProducts(result.data)
    }

    //call functions
    fetchProducts()
  }, [])

  let deletedProductRequest = async (pId) => {
    try {
      let result = await axios.delete("http://localhost:5000/api/deleteproduct", {
        data: { prodId: pId }
      })
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  

  
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
                  sm: 12,
                  md: 6,
                  lg: 4
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
                    </CardContent>
                    <CardActions>
                      <Button onClick={() => {

                        deletedProductRequest(prod._id)

                      }} variant='contained' color='error'>Delete</Button>
                      <Button variant='contained' onClick={() => {
                        openUpdateDialog(prod)
                      }} color='primary' >Update</Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            }

            )
          }
        </Grid>
        <Dialog open={openDialog} onClose={closeUpdateDialog} >

          <DialogTitle>
            Update Price
          </DialogTitle>
          <DialogContent>
            
              <TextField onChange={(e) => setnewPrice(e.target.value)} label="Enter Updated Price" name="price" />
           
          </DialogContent>
          <DialogActions>
            <Button onClick={() => updateprodPrice()} variant='contained' color='primary'>Submit</Button>
            <Button onClick={() => closeUpdateDialog()} variant='contained' color='error'>Close</Button>

          </DialogActions>
        </Dialog>
      </Box>


    </>
  )

}
export default Products