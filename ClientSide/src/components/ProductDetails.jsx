import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Card, CardMedia, CardContent, Typography } from '@mui/material';

const ProductDetails = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">No product details found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={`http://localhost:5000/${product.prodimage}`}
          alt={product.title}
        />
        <CardContent>
          <Typography variant="h5" gutterBottom>{product.title}</Typography>
          <Typography variant="subtitle1" gutterBottom>Brand: {product.brand}</Typography>
          <Typography variant="subtitle2" gutterBottom>Category: {product.category}</Typography>
          <Typography variant="body1" gutterBottom>{product.description}</Typography>
          <Typography variant="h6" color="primary" gutterBottom>₹{product.price}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Discount: {product.discountPercentage}%
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDetails;