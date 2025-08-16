import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Container,
  Chip,
  Rating,
  Paper,
  IconButton,
  Fade,
  Slide
} from '@mui/material';
import {
  ShoppingCart,
  Visibility,
  TrendingUp,
  LocalShipping,
  Security,
  SupportAgent,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../reduxwork/CartSlice';
import axios from 'axios';
import { login } from '../reduxwork/UserSlice';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user);


useEffect(() => {
  axios.get("http://localhost:5000/api/auth/me", { withCredentials: true })
    .then(res => {
      if (res.data.userPhone === null) 
        {
          navigate('/completeprofile')
        
      }
      if (res.data?.userName) {
        dispatch(login(res.data));
      }
    })
    .catch(() => {
      dispatch(logout());
    });
}, [dispatch]);



  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const result = await axios.get("http://localhost:5000/api/fetchproducts");
        // Get first 4 products as featured
        setFeaturedProducts(result.data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchFeaturedProducts();
    setLoaded(true);
  }, []);

  const handleAddToCart = (prod) => {
    if (!isLogin) {
      alert('Please login first to add items to cart.');
      navigate('/login');
      return;
    }
    dispatch(addItem(prod));
  };

  const heroSection = (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Fade in={loaded} timeout={1000}>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Welcome to ShopEase
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Discover amazing products at unbeatable prices
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
      {isLogin ? (
         <Button
    variant="contained"
    size="large"
    sx={{
      bgcolor: 'white',
      color: '#667eea',
      '&:hover': { bgcolor: '#f5f5f5' },
      px: 4,
      py: 1.5
    }}
    onClick={() => navigate('/products')}
    endIcon={<ArrowForward />}
  >
    Shop Now
  </Button>

      ):(
         <>
    <Button
      variant="outlined"
      size="large"
      sx={{
        borderColor: 'white',
        color: 'white',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
        px: 4,
        py: 1.5
      }}
      onClick={() => navigate('/register')}
    >
      Sign Up Today
    </Button>
    <Button
      variant="contained"
      size="large"
      sx={{
        bgcolor: 'white',
        color: '#667eea',
        '&:hover': { bgcolor: '#f5f5f5' },
        px: 4,
        py: 1.5
      }}
      onClick={() => navigate('/products')}
      endIcon={<ArrowForward />}
    >
      Shop Now
    </Button>
  </>
        
        
      )}
</Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );

  const featuresSection = (
    <Container maxWidth="lg" sx={{ py: 8, mb: 4 }}>
      <Typography variant="h3" textAlign="center" sx={{ mb: 6, fontWeight: 'bold' }}>
        Why Choose Us?
      </Typography>
      <Grid container spacing={4} sx={{ px: 2 }}>
        {[
          { icon: <LocalShipping />, title: 'Free Shipping', desc: 'Free delivery on orders over ₹500' },
          { icon: <Security />, title: 'Secure Payment', desc: '100% secure payment processing' },
          { icon: <SupportAgent />, title: '24/7 Support', desc: 'Round the clock customer support' },
          { icon: <TrendingUp />, title: 'Best Prices', desc: 'Competitive prices guaranteed' }
        ].map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Slide direction="up" in={loaded} timeout={800 + index * 200}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  minHeight: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}
              >
                <Box sx={{ color: '#667eea', mb: 2, fontSize: 40 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.desc}
                </Typography>
              </Paper>
            </Slide>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  const featuredProductsSection = (
    <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" textAlign="center" sx={{ mb: 6, fontWeight: 'bold' }}>
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {featuredProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <Fade in={loaded} timeout={1000 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardMedia
                    sx={{ height: 200, position: 'relative' }}
                    image={`http://localhost:5000/${product.prodimage}`}
                    title={product.title}
                  >
                    <Chip
                      label="Featured"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: '#ff4444',
                        color: 'white'
                      }}
                    />
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.category}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={4.5} precision={0.5} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        (4.5)
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#667eea',
                        fontWeight: 'bold'
                      }}
                    >
                      ₹{product.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: product.isAvailable ? 'green' : 'red',
                        fontWeight: 'bold'
                      }}
                    >
                      {product.isAvailable ? '✓ In Stock' : '✗ Out of Stock'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.isAvailable}
                      sx={{
                        bgcolor: '#667eea',
                        '&:hover': { bgcolor: '#5a6fd8' }
                      }}
                    >
                      Add to Cart
                    </Button>
                    <IconButton
                      onClick={() => navigate('/products-details', { state: { product } })}
                      sx={{ color: '#667eea' }}
                    >
                      <Visibility />
                    </IconButton>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/products')}
            endIcon={<ArrowForward />}
            sx={{
              color: '#667eea',
              borderColor: '#667eea',
              '&:hover': { bgcolor: '#667eea', color: 'white' }
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );

  const callToActionSection = (
    <Box
      sx={{
        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          Ready to Start Shopping?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Join thousands of satisfied customers and discover your next favorite product today!
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              '&:hover': { bgcolor: '#f5f5f5' },
              px: 4,
              py: 1.5
            }}
            onClick={() => navigate('/products')}
          >
            Browse Products
          </Button>
          {!isLogin && (
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5
              }}
              onClick={() => navigate('/login')}
            >
              Create Account
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {heroSection}
      {featuresSection}
      {featuredProductsSection}
      {callToActionSection}
    </Box>
  );
};

export default Home;
