import React, { useState } from 'react';
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  Stack,
  Snackbar,
} from '@mui/material';
import axios from 'axios';

const AddProduct = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event) => {
     setOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let reqData = Object.fromEntries(formData.entries());
    console.log('REQ', reqData);
     

    let result = await axios.post(
      'http://localhost:5000/api/createproduct',
      { ...reqData, prodimage: selectedImage },
      
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log(result.data);
    alert(result.data.message);
  };

  return (
    <Box
      component="form"
      sx={{
        maxWidth: 500,
        margin: 'auto',
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#fff',
      }}
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" textAlign="center" mb={3}>
        Add Product
      </Typography>

      <Stack spacing={2}>
        <TextField label="Title" name="title" type="text" fullWidth required />
        <TextField label="Description" name="description" type="text" fullWidth required />
        <TextField label="Brand" name="brand" type="text" fullWidth required />

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select label="Category" name="category" required defaultValue="">
            <MenuItem value="beauty">Beauty</MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="fashion">Fashion</MenuItem>
            <MenuItem value="home">Home</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Price"
          name="price"
          type="number"
          fullWidth
          required
        />
        <TextField
          label="Discount Percentage"
          name="discountPercentage"
          type="number"
          fullWidth
        />

        <Button
          variant="outlined"
          component="label"
          sx={{ justifyContent: 'flex-start' }}
        >
          Upload Image
          <input
            type="file"
            name="prodimage"
            hidden
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
        </Button>

        <Button variant="contained" color="primary" type="submit" onClick={()=> handleClick()}>
          Create Product
        </Button>
      </Stack>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Product Added to cart"
        // action={action}
      />
    </Box>
  );
};

export default AddProduct;
