import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Paper,
  Skeleton,
  Alert,
  Collapse,
  Fade,
  Zoom,
  Tooltip,
  Rating,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Breadcrumbs,
  Link,
  Fab
} from '@mui/material';
import {
  Favorite,
  Delete,
  ShoppingCart,
  Share,
  Compare,
  Visibility,
  FilterList,
  GridView,
  ViewList,
  Sort,
  Clear,
  FavoriteBorder,
  ArrowUpward,
  ShoppingBag,
  LocalOffer
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addItem } from '../reduxwork/CartSlice';

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userData, isLogin } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    fetchWishlist();
  }, [userData?._id]);

  const fetchWishlist = async () => {
    if (!userData?._id) return;
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/fetchwishlistsbyuser', {
        userId: userData._id,
      });

       

      const wishlistProducts = response.data.data?.products || [];
      setWishlistItems(wishlistProducts);
      
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setAlert({
        show: true,
        message: 'Failed to load wishlist. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.post('http://localhost:5000/api/deletewishlist', {
        userId: userData._id,
        productId: productId,
      });
      
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      setSnackbar({
        open: true,
        message: 'Item removed from wishlist',
        severity: 'success'
      });
      setShowDeleteDialog(false);
      
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setSnackbar({
        open: true,
        message: 'Failed to remove item from wishlist',
        severity: 'error'
      });
    }
  };

   const handleAddToCart = async (product) => {
    const isInCart = cartItems.some(item => item._id === product._id);
    if (isInCart) {
      setSnackbar({
        open: true,
        message: 'Product is already in cart',
        severity: 'warning'
      });
      return;
    }

    dispatch(addItem(product));
    setSnackbar({
      open: true,
      message: `${product.title} added to cart!`,
      severity: 'success'
    });

     try {
    await axios.post('http://localhost:5000/api/deletewishlist', {
      userId: userData._id,
      productId: product._id,
    });
    // 3. Update the state
    setWishlistItems(prev => prev.filter(item => item._id !== product._id));
  } catch (error) {
    setSnackbar({
      open: true,
      message: 'Failed to remove from wishlist after adding to cart',
      severity: 'error'
    });
  }
  };

  const handleDeleteClick = (product) => {
    setItemToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleMoveAllToCart = () => {
    let addedCount = 0;
    wishlistItems.forEach(product => {
      const isInCart = cartItems.some(item => item._id === product._id);
      if (!isInCart && product.isAvailable) {
        dispatch(addItem(product));
        addedCount++;
      }
    });
    
    setSnackbar({
      open: true,
      message: `${addedCount} items added to cart`,
      severity: 'success'
    });
  };

  const sortedWishlistItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title?.localeCompare(b.title) || 0;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  const renderWishlistCard = (product, index) => (
    <Zoom in timeout={600 + index * 100} key={product._id}>
      <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} lg={viewMode === 'grid' ? 3 : 12}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: viewMode === 'list' ? 'row' : 'column',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'visible',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: 6,
              '& .product-actions': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          {/* Sale Badge */}
          {product.price < 1000 && (
            <Chip
              label="SALE"
              color="error"
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                zIndex: 2,
                fontWeight: 'bold'
              }}
            />
          )}

          {/* Remove from Wishlist Button */}
          <Tooltip title="Remove from Wishlist">
            <IconButton
              onClick={() => handleDeleteClick(product)}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Favorite />
            </IconButton>
          </Tooltip>

          <CardMedia
            sx={{
              height: viewMode === 'grid' ? 250 : 200,
              width: viewMode === 'list' ? 200 : '100%',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            image={`http://localhost:5000/${product.prodimage}`}
            title={product.title}
            onClick={() => navigate('/products-details', { state: { product } })}
          >
            {/* Hover Actions */}
            <Box
              className="product-actions"
              sx={{
                position: 'absolute',
                bottom: 12,
                left: '50%',
                transform: 'translateX(-50%) translateY(20px)',
                opacity: 0,
                transition: 'all 0.3s ease',
                display: 'flex',
                gap: 1
              }}
            >
              <Tooltip title="Quick View">
                <IconButton
                  size="small"
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/products-details', { state: { product } });
                  }}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add to Cart">
                <IconButton
                  size="small"
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={!product.isAvailable}
                >
                  <ShoppingCart />
                </IconButton>
              </Tooltip>
            </Box>
          </CardMedia>

          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
              onClick={() => navigate('/products-details', { state: { product } })}
            >
              {product.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip label={product.category} size="small" variant="outlined" />
              {product.brand && <Chip label={product.brand} size="small" color="primary" />}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={4.5} size="small" readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                (4.5)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: product.price > 15000 ? 'error.main' : 'primary.main'
                }}
              >
                ₹{product.price?.toLocaleString()}
              </Typography>
              <Chip
                label={product.isAvailable ? 'In Stock' : 'Out of Stock'}
                color={product.isAvailable ? 'success' : 'error'}
                size="small"
              />
            </Box>

            {viewMode === 'list' && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                High-quality {product.category?.toLowerCase()} from {product.brand} with excellent features and reliable performance.
              </Typography>
            )}
          </CardContent>

          <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
            <Button
              variant="contained"
              fullWidth={viewMode === 'grid'}
              startIcon={<ShoppingCart />}
              onClick={() => handleAddToCart(product)}
              disabled={!product.isAvailable}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)'
                }
              }}
            >
              {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            {viewMode === 'list' && (
              <IconButton
                color="error"
                onClick={() => handleDeleteClick(product)}
                sx={{ ml: 1 }}
              >
                <Delete />
              </IconButton>
            )}
          </CardActions>
        </Card>
      </Grid>
    </Zoom>
  );

  const renderControls = () => (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            My Wishlist ({wishlistItems.length})
          </Typography>
          {wishlistItems.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ShoppingCart />}
              onClick={handleMoveAllToCart}
              sx={{ minWidth: 'auto' }}
            >
              Move All to Cart
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Sort By */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="name">Name A-Z</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="newest">Newest First</MenuItem>
            </Select>
          </FormControl>

          {/* View Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newView) => newView && setViewMode(newView)}
            size="small"
          >
            <ToggleButton value="grid">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
    </Paper>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {renderControls()}
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={n}>
              <Card>
                <Skeleton variant="rectangular" height={250} />
                <CardContent>
                  <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Alert */}
      <Collapse in={alert.show}>
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, show: false })}
          sx={{ mb: 3 }}
        >
          {alert.message}
        </Alert>
      </Collapse>

      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate('/')}>
          Home
        </Link>
        <Typography color="text.primary">Wishlist</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          My Wishlist
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {wishlistItems.length > 0 
            ? `You have ${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} in your wishlist`
            : 'Your wishlist is empty. Start adding items you love!'
          }
        </Typography>
      </Box>

      {/* Controls */}
      {wishlistItems.length > 0 && renderControls()}

      {/* Wishlist Items or Empty State */}
      {sortedWishlistItems.length > 0 ? (
        <Grid container spacing={3}>
          {sortedWishlistItems.map((product, index) => renderWishlistCard(product, index))}
        </Grid>
      ) : (
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)'
          }}
        >
          <FavoriteBorder sx={{ fontSize: 120, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Your Wishlist is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Discover amazing products and add them to your wishlist for later!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBag />}
            onClick={() => navigate('/products')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
              }
            }}
          >
            Browse Products
          </Button>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Remove from Wishlist</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove "{itemToDelete?.title}" from your wishlist?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handleRemoveFromWishlist(itemToDelete?._id)}
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Scroll to Top FAB */}
      {wishlistItems.length > 6 && (
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
          <ArrowUpward />
        </Fab>
      )}
    </Container>
  );
};

export default WishList;
