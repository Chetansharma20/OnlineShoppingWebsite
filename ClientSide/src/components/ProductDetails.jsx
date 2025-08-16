import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
  Divider,
  Rating,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
  Badge,
  Tooltip,
  Collapse,
  Skeleton,
  Tabs,
  Tab,
  Fab,
  ButtonGroup
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  ArrowBack,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  Star,
  StarBorder,
  Person,
  Add,
  Remove,
  Security,
  LocalShipping,
  AssignmentReturn,
  CheckCircle
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../reduxwork/CartSlice';
import axios from 'axios';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = location.state?.product;

  const { userData, isLogin } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isFavorite, setIsFavorite] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState(false);

  useEffect(() => {
    if (product?._id) {
      fetchReviews();
      checkWishlistStatus();
    }
  }, [product?._id, userData?._id]);



  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await axios.get('http://localhost:5000/api/fetchreviews');
      // Filter reviews for this specific product
      console.log(response)
    
      const productReviews = response.data.filter(review => review.productId?._id === product._id);
      console.log(productReviews)
      setReviews(productReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]); // Set empty array on error
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!userData?._id) return;
    try {
      const response = await axios.post('http://localhost:5000/api/fetchwishlistsbyuser', {
        userId: userData._id,
      });
      const wishlistItems = response.data.data?.products || [];
      setIsFavorite(wishlistItems.some(item => item._id === product._id));
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleAddReview = async () => {
    if (!isLogin) {
      setSnackbar({ open: true, message: 'Please login to add a review', severity: 'warning' });
      navigate('/login');
      return;
    }

    if (newReview.rating === 0 || !newReview.comment.trim()) {
      setSnackbar({ open: true, message: 'Please provide both rating and comment', severity: 'warning' });
      return;
    }

    try {
      setIsSubmitting(true);
    let result =   await axios.post('http://localhost:5000/api/createreviewsbyuser', {
        productId: product._id,
        userId: userData._id,
        rating: newReview.rating,
        comment: newReview.comment.trim()
      });
console.log(result)
      setSnackbar({ open: true, message: 'Review added successfully!', severity: 'success' });
      setShowAddReview(false);
      setNewReview({ rating: 0, comment: '' }); 
      // Refresh reviews to get the latest data
      fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
      setSnackbar({ open: true, message: 'Failed to add review. Please try again.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isLogin) {
      setSnackbar({ open: true, message: 'Please login to manage wishlist', severity: 'warning' });
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await axios.post('http://localhost:5000/api/deletewishlist', {
          userId: userData._id,
          productId: product._id,
        });
        setIsFavorite(false);
        setSnackbar({ open: true, message: 'Removed from wishlist', severity: 'success' });
      } else {
        await axios.post('http://localhost:5000/api/createwishlist', {
          userId: userData._id,
          productId: product._id,
        });
        setIsFavorite(true);
        setSnackbar({ open: true, message: 'Added to wishlist', severity: 'success' });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      setSnackbar({ open: true, message: 'Failed to update wishlist', severity: 'error' });
    }
  };

  const handleAddToCart = () => {
    const isInCart = cartItems.some(item => item._id === product._id);
    if (isInCart) {
      setSnackbar({ open: true, message: 'Product is already in cart', severity: 'warning' });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      dispatch(addItem(product));
    }
    setSnackbar({ open: true, message: `${product.title} added to cart!`, severity: 'success' });
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const renderStarDistribution = () => {
    if (reviews.length === 0) {
      return (
        <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No ratings yet. Be the first to rate this product!
          </Typography>
        </Paper>
      );
    }

    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(review => review.rating === star).length,
      percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === star).length / reviews.length) * 100 : 0
    }));

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Rating Distribution</Typography>
        {distribution.map(({ star, count, percentage }) => (
          <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 60 }}>
              {star} star{star !== 1 && 's'}
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                height: 8,
                backgroundColor: 'grey.200',
                borderRadius: 1,
                mx: 2,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  backgroundColor: 'primary.main',
                  width: `${percentage}%`,
                  transition: 'width 0.3s ease'
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
              {count}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const renderReviews = () => {
    const displayedReviews = expandedReviews ? reviews : reviews.slice(0, 3);
    
console.log(displayedReviews)
    return (



      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Customer Reviews ({reviews.length})
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowAddReview(true)}
            disabled={!isLogin}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
              }
            }}
          >
            Write a Review
          </Button>
        </Box>

        {reviewsLoading ? (
          <Box>
            {[1, 2, 3].map(n => (
              <Paper key={n} sx={{ p: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="circular" width={48} height={48} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="80%" />
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : reviews.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No reviews yet. Be the first to review this product!
            </Typography>
          </Paper>
        ) : (
          <List sx={{ width: '100%' }}>
            {displayedReviews.map((review, index) => (
              <Paper key={index} sx={{ mb: 2, p: 2 }}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {review.userId?.userName || 'Anonymous User'}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {review.comment}
                      </Typography>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
            
            {reviews.length > 3 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  onClick={() => setExpandedReviews(!expandedReviews)}
                  endIcon={expandedReviews ? <ExpandLess /> : <ExpandMore />}
                >
                  {expandedReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                </Button>
              </Box>
            )}
          </List>
        )}
      </Box>
    );
  };

  if (!product) {
    return (
     
     <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h6">No product details found.</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate('/')}>
          Home
        </Link>
        <Link underline="hover" color="inherit" onClick={() => navigate('/products')}>
          Products
        </Link>
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images & Info */}
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                sx={{ height: { xs: 300, md: 500 }, objectFit: 'cover' }}
                image={`http://localhost:5000/${product.prodimage}`}
                alt={product.title}
              />
              
              {/* Sale Badge */}
              {product.discountPercentage > 0 && (
                <Chip
                  label={`${product.discountPercentage}% OFF`}
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                />
              )}

              {/* Action Buttons */}
              <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                <Tooltip title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                  <IconButton
                    onClick={handleToggleWishlist}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                    }}
                  >
                    {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                    }}
                  >
                    <Share />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {product.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip label={product.brand} color="primary" />
                <Chip label={product.category} variant="outlined" />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={parseFloat(calculateAverageRating())} readOnly precision={0.1} />
                  <Typography variant="body2" color="text.secondary">
                    ({calculateAverageRating()}) • {reviews.length} reviews
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h3" color="primary.main" fontWeight="bold" sx={{ mb: 2 }}>
                ₹{product.price?.toLocaleString()}
                {product.discountPercentage > 0 && (
                  <Typography
                    component="span"
                    variant="h5"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                      ml: 2
                    }}
                  >
                    ₹{Math.round(product.price / (1 - product.discountPercentage / 100)).toLocaleString()}
                  </Typography>
                )}
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                {product.description}
              </Typography>

              {/* Trust Indicators */}
              <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security color="success" />
                  <Typography variant="body2">Secure Payment</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShipping color="info" />
                  <Typography variant="body2">Fast Delivery</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentReturn color="warning" />
                  <Typography variant="body2">Easy Returns</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Tabs for Details and Reviews */}
          <Paper elevation={3}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Reviews" />
              <Tab label="Product Details" />
            </Tabs>
            
            <Box sx={{ p: 4 }}>
              {tabValue === 0 && (
                <Box>
                  {renderStarDistribution()}
                  <Divider sx={{ my: 3 }} />
                  {renderReviews()}
                </Box>
              )}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Specifications</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Brand</Typography>
                      <Typography variant="body1" fontWeight="bold">{product.brand}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Category</Typography>
                      <Typography variant="body1" fontWeight="bold">{product.category}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Discount</Typography>
                      <Typography variant="body1" fontWeight="bold">{product.discountPercentage}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Availability</Typography>
                      <Chip
                        label={product.isAvailable ? 'In Stock' : 'Out of Stock'}
                        color={product.isAvailable ? 'success' : 'error'}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Purchase Section */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              position: 'sticky',
              top: 100,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Purchase Options
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Quantity
              </Typography>
              <ButtonGroup fullWidth>
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Remove />
                </Button>
                <Button disabled sx={{ flexGrow: 1 }}>
                  {quantity}
                </Button>
                <Button onClick={() => setQuantity(quantity + 1)}>
                  <Add />
                </Button>
              </ButtonGroup>
            </Box>

            <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ mb: 3 }}>
              Total: ₹{(product.price * quantity).toLocaleString()}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              sx={{
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
                }
              }}
            >
              {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Review Dialog */}
      <Dialog
        open={showAddReview}
        onClose={() => setShowAddReview(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography component="legend" sx={{ mb: 1 }}>Rating</Typography>
            <Rating
              value={newReview.rating}
              onChange={(event, newValue) => {
                setNewReview({ ...newReview, rating: newValue });
              }}
              size="large"
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Your Review"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Share your experience with this product..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddReview(false)}>Cancel</Button>
          <Button
            onClick={handleAddReview}
            variant="contained"
            disabled={isSubmitting || newReview.rating === 0 || !newReview.comment.trim()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Back to top */}
      <Fab
        color="primary"
        size="medium"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
          }
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowBack sx={{ transform: 'rotate(90deg)' }} />
      </Fab>
    </Container>
  );
};

export default ProductDetails;
