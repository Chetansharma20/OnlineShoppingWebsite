import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  IconButton,
  Divider,
  Paper,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Link,
  Collapse,
  Fade,
  Zoom,
  Tooltip,
  Badge,
  Skeleton,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
  ButtonGroup
} from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  LocalShipping,
  Security,
  ArrowBack,
  Clear,
  Favorite,
  Share,
  CheckCircle,
  LocalOffer,
  Receipt,
  TrendingUp
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateTotal,
  decrementQty,
  incrementQty,
  removeItem,
  clearCart,
} from "../reduxwork/CartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Carts = () => {
  const { cartItems, cartTotalAmount, cartItemCount } = useSelector((state) => state.cart);
  const { userData } = useSelector((state) => state.user);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    dispatch(calculateTotal());
  }, [cartItems, dispatch]);

  const handleRemoveItem = (item) => {
    setItemToRemove(item);
    setShowRemoveDialog(true);
  };
    const goToCheckout = () => {
    navigate("/checkout", {
      state: { cartItems, cartTotalAmount, shippingCost }
    });
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      dispatch(removeItem({ pId: itemToRemove._id }));
      setAlert({
        show: true,
        message: `${itemToRemove.title} removed from cart`,
        severity: 'success'
      });
      setShowRemoveDialog(false);
      setItemToRemove(null);
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setShowClearDialog(false);
    setAlert({
      show: true,
      message: 'Cart cleared successfully',
      severity: 'success'
    });
  };

  const postOrder = async () => {
   
    // if (cartItems.length === 0) {
    //   setAlert({
    //     show: true,
    //     message: 'Your cart is empty',
    //     severity: 'warning'
    //   });
    //   return;
    // }

    setIsLoading(true);

    const finalItems = cartItems.map((item) => ({
      prodId: item._id,
      qty: item.qty,
    }));

    const orderReqData = {
      orderTotalAmount: cartTotalAmount,
      userId: userData._id,
      orderItems: finalItems,
    };

    try {
      const result = await axios.post(
        "http://localhost:5000/api/createorder",
        orderReqData
      );
      dispatch(clearCart());
      setOrderSuccess(true);
      setAlert({
        show: true,
        message: 'Order placed successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error(error);
      setAlert({
        show: true,
        message: 'Failed to place order. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSavings = () => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.price * 1.2; // Assume 20% discount
      return total + ((originalPrice - item.price) * item.qty);
    }, 0);
  };

  const shippingCost = cartTotalAmount > 1000 ? 0 : 99;
  const totalSavings = calculateSavings();

  const renderCartItem = (item, index) => (
    <Zoom in timeout={400 + index * 100} key={item._id}>
      <Card
        sx={{
          mb: 2,
          overflow: 'visible',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            {/* Product Image */}
            <Box
              sx={{
                position: 'relative',
                minWidth: { xs: 80, sm: 120 },
                height: { xs: 80, sm: 120 },
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/products-details', { state: { product: item } })}
            >
              <CardMedia
                component="img"
                image={`http://localhost:5000/${item.prodimage}`}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              />
              {item.price < 1000 && (
                <Chip
                  label="SALE"
                  color="error"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Box>

            {/* Product Details */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mr: 1
                  }}
                  onClick={() => navigate('/products-details', { state: { product: item } })}
                >
                  {item.title}
                </Typography>
                <Tooltip title="Remove from cart">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveItem(item)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'error.light',
                        color: 'white'
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label={item.category} size="small" variant="outlined" />
                {item.brand && <Chip label={item.brand} size="small" color="primary" />}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                {/* Price */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ₹{(item.price * item.qty).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{item.price.toLocaleString()} each
                  </Typography>
                </Box>

                {/* Quantity Controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Qty:
                  </Typography>
                  <ButtonGroup size="small" variant="outlined">
                    <IconButton
                      onClick={() => dispatch(decrementQty({ pId: item._id }))}
                      disabled={item.qty <= 1}
                      sx={{
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderLeft: 'none',
                        borderRight: 'none',
                        minWidth: 40,
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {item.qty}
                    </Box>
                    <IconButton
                      onClick={() => dispatch(incrementQty({ pId: item._id }))}
                      sx={{
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </ButtonGroup>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  const renderOrderSummary = () => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        position: 'sticky',
        top: 100,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Order Summary
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal ({cartItemCount} items)</Typography>
          <Typography fontWeight="bold">₹{cartTotalAmount.toLocaleString()}</Typography>
        </Box>

        {totalSavings > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="success.main">You Save</Typography>
            <Typography fontWeight="bold" color="success.main">
              -₹{totalSavings.toLocaleString()}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography component="span">Shipping</Typography>
            {cartTotalAmount > 1000 && <Chip label="FREE" color="success" size="small" />}
          </Box>
          <Typography fontWeight="bold" color={shippingCost === 0 ? 'success.main' : 'inherit'}>
            {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
          </Typography>
        </Box>

        {cartTotalAmount <= 1000 && (
          <Typography variant="body2" color="info.main" sx={{ mb: 1 }} component="div">
            Add ₹{(1000 - cartTotalAmount).toLocaleString()} more for FREE shipping
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Total</Typography>
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          ₹{(cartTotalAmount + shippingCost).toLocaleString()}
        </Typography>
      </Box>

      {/* Security & Shipping Info */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Security color="success" fontSize="small" />
          <Typography variant="body2">Secure checkout</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LocalShipping color="info" fontSize="small" />
          <Typography variant="body2">Fast delivery</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle color="success" fontSize="small" />
          <Typography variant="body2">Easy returns</Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        startIcon={<CreditCard />}
        // onClick={postOrder}
        disabled={isLoading || cartItems.length === 0}
        sx={{
          mb: 2,
          py: 1.5,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
          },
          '&:disabled': {
            background: 'rgba(0, 0, 0, 0.12)'
          }
        }}
        onClick= {goToCheckout}
      >
        {isLoading ? 'Proceed to checkout': 'Proceed to checkout'}
      </Button>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<ShoppingBag />}
        onClick={() => navigate('/products')}
      >
        Continue Shopping
      </Button>
    </Paper>
  );

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate('/')}>
            Home
          </Link>
          <Typography color="text.primary">Shopping Cart</Typography>
        </Breadcrumbs>

        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)'
          }}
        >
          <ShoppingCart sx={{ fontSize: 120, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
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
            Start Shopping
          </Button>
        </Paper>
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
        <Typography color="text.primary">Shopping Cart</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Shopping Cart
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
          </Typography>
        </Box>
        {cartItems.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Clear />}
            onClick={() => setShowClearDialog(true)}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Clear Cart
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Box>
            {cartItems.map((item, index) => renderCartItem(item, index))}
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          {renderOrderSummary()}
        </Grid>
      </Grid>

      {/* Remove Item Dialog */}
      <Dialog
        open={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove "{itemToRemove?.title}" from your cart?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRemoveDialog(false)}>Cancel</Button>
          <Button onClick={confirmRemoveItem} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Cart Dialog */}
      <Dialog
        open={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Clear Cart</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)}>Cancel</Button>
          <Button onClick={handleClearCart} color="error" variant="contained">
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Success Snackbar */}
      <Snackbar
        open={orderSuccess}
        autoHideDuration={5000}
        onClose={() => setOrderSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setOrderSuccess(false)} sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle />
            Order placed successfully! Check your orders page for details.
          </Box>
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Carts;

