import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,

  Container,
  Fade,
  Skeleton,
  IconButton,
  Tooltip,
  Badge,
  Alert,
  Collapse,
  Tab,
  Tabs,
  AppBar
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
  Receipt,
  CalendarToday,
  AttachMoney,
  Refresh,
  Download,
  Star,
  StarBorder,
  ArrowBack,

} from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const Orders = () => {
  const { userData } = useSelector((state) => state.user);
  console.log(userData)
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });

  const orderStatuses = ['All', 'Pending', 'Shipped', 'Delivered'];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Pending />;
      case 'processing': return <LocalShipping />;
      case 'shipped': return <LocalShipping />;
      case 'delivered': return <CheckCircle />;
      case 'cancelled': return <Cancel />;
      default: return <ShoppingBag />;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        // Check if userData and userId are valid
        if (!userData || !userData._id) {
          console.warn('User data or user ID is missing');
          setAlert({
            show: true,
            message: 'User information is required to fetch orders. Please log in again.',
            severity: 'warning'
          });
          return;
        }

        console.log('Fetching orders for user:', userData._id);

        const result = await axios.post(
          "http://localhost:5000/api/fetchordersbyuser",
          { userId: userData._id }
        );

        console.log('Orders API response:', result.data);

        // Handle different response structures
        const ordersData = result.data?.data || result.data || [];
        setAllOrders(ordersData);
        setFilteredOrders(ordersData);

        if (ordersData.length === 0) {
          console.log('No orders found for user');
        }

      } catch (error) {
        console.error("Error fetching orders:", error);

        let errorMessage = 'Failed to load orders. Please try again.';

        if (error.response?.status === 500) {
          errorMessage = 'Server error occurred. Please check if the backend server is running on port 5000.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Orders service not found. Please contact support.';
        } else if (error.code === 'ECONNREFUSED') {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        setAlert({
          show: true,
          message: errorMessage,
          severity: 'error'
        });

        // Set empty arrays to prevent further errors
        setAllOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user data exists and has valid ID
    if (userData?._id) {
      fetchOrders();
    } else {
      // If no user data, set loading to false and show empty state
      setLoading(false);
      setAllOrders([]);
      setFilteredOrders([]);

      if (userData === null || userData === undefined) {
        setAlert({
          show: true,
          message: 'Please log in to view your orders.',
          severity: 'info'
        });
      }
    }
  }, [userData, userData?._id]);

  useEffect(() => {
    let filtered = [...allOrders];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderItems.some(item =>
          item.prodId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order =>
        order.orderstatus?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.orderDate) - new Date(a.orderDate);
        case 'oldest':
          return new Date(a.orderDate) - new Date(b.orderDate);
        case 'amount-high':
          return b.orderTotalAmount - a.orderTotalAmount;
        case 'amount-low':
          return a.orderTotalAmount - b.orderTotalAmount;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [allOrders, searchTerm, statusFilter, sortBy]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const getOrderSummary = () => {
    const summary = {
      total: allOrders.length,
      pending: allOrders.filter(o => o.orderstatus?.toLowerCase() === 'pending').length,
      delivered: allOrders.filter(o => o.orderstatus?.toLowerCase() === 'delivered').length,
      totalSpent: allOrders.reduce((sum, order) => sum + order.orderTotalAmount, 0)
    };
    return summary;
  };

  const renderOrderCard = (order) => (
    <Fade in timeout={600} key={order._id}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
        onClick={() => handleOrderClick(order)}
      >
        {/* Order Images */}
        <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          {order.orderItems?.length > 0 && (
            <Box sx={{ display: 'flex', height: '100%' }}>
              {order.orderItems.slice(0, 3).map((item, idx) => (
                <CardMedia
                  key={idx}
                  sx={{
                    flex: 1,
                    height: '100%',
                    borderRight: idx < 2 ? '2px solid white' : 'none'
                  }}
                  image={`http://localhost:5000/${item.prodId?.prodimage}`}
                  title={item.prodId?.title}
                />
              ))}
              {order.orderItems.length > 3 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '33.33%',
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    +{order.orderItems.length - 3}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          
          {/* Status Badge */}
          <Chip
            label={order.orderstatus}
            color={getStatusColor(order.orderstatus)}
            icon={getStatusIcon(order.orderstatus)}
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontWeight: 'bold'
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Order ID */}
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {order.orderItems.map((item) => item.prodId?.title).join(", ")}
          </Typography>

          {/* Order Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {dayjs(order.orderDate).format("DD MMM YYYY, hh:mm A")}
            </Typography>
          </Box>

          {/* Items Count */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShoppingBag sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {order.orderItems?.length || 0} items
            </Typography>
          </Box>

          {/* Total Amount */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoney sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
              <Typography variant="body2" color="text.secondary">
                Total:
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              ₹{order.orderTotalAmount?.toLocaleString()}
            </Typography>
          </Box>

          {/* View Details Button */}
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Visibility />}
            sx={{ mt: 2 }}
            onClick={(e) => {
              e.stopPropagation();
              handleOrderClick(order);
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" fontWeight="bold">
              Order Details
            </Typography>
            <Chip
              label={selectedOrder.orderstatus}
              color={getStatusColor(selectedOrder.orderstatus)}
              icon={getStatusIcon(selectedOrder.orderstatus)}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Order #{selectedOrder._id.slice(-8).toUpperCase()}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            {/* Order Info */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Order Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Date:</strong> {dayjs(selectedOrder.orderDate).format("DD MMM YYYY, hh:mm A")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Total:</strong> ₹{selectedOrder.orderTotalAmount?.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingBag sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Items:</strong> {selectedOrder.orderItems?.length || 0}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Order Timeline */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Order Status Timeline
                </Typography>
                <Box>
                  {/* Custom Timeline Implementation */}
                  {[
                    {
                      title: 'Order Placed',
                      status: 'completed',
                      icon: <CheckCircle />,
                      time: dayjs(selectedOrder.orderDate).format("DD MMM, HH:mm"),
                      color: 'success'
                    },
                    
                    {
                      title: 'Processing',
                      status: selectedOrder.orderstatus?.toLowerCase() === 'processing' ||
                              selectedOrder.orderstatus?.toLowerCase() === 'shipped' ||
                              selectedOrder.orderstatus?.toLowerCase() === 'delivered' ? 'completed' : 'pending',
                      icon: <LocalShipping />,
                      time: selectedOrder.orderstatus?.toLowerCase() === 'shipped' ? 'Current Status' : 'Pending',
                      color: 'info'
                    },
                    {
                      title: 'Delivered',
                      status: selectedOrder.orderstatus?.toLowerCase() === 'delivered' ? 'completed' : 'pending',
                      icon: <CheckCircle />,
                      time: selectedOrder.orderstatus?.toLowerCase() === 'delivered' ? 'Completed' : 'Pending',
                      color: 'success'
                    }
                  ].map((step, index, array) => (
                    <Box key={step.title} sx={{ display: 'flex', mb: index < array.length - 1 ? 2 : 0 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: step.status === 'completed' ? `${step.color}.main` : 'grey.300',
                            color: 'white',
                            width: 40,
                            height: 40
                          }}
                        >
                          {step.icon}
                        </Avatar>
                        {index < array.length - 1 && (
                          <Box
                            sx={{
                              width: 2,
                              height: 30,
                              bgcolor: step.status === 'completed' ? `${step.color}.main` : 'grey.300',
                              mt: 1
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ flex: 1, pt: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {step.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {step.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Order Items */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Order Items
              </Typography>
              <List>
                {selectedOrder.orderItems?.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          src={`http://localhost:5000/${item.prodId?.prodimage}`}
                          sx={{ width: 60, height: 60, borderRadius: 2 }}
                          variant="rounded"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.prodId?.title || 'Product'}
                        secondary={
                          <Box component="span" sx={{ display: 'block' }}>
                            <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block' }}>
                              Category: {item.prodId?.category || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block' }}>
                              Quantity: {item.qty || 1}
                            </Typography>
                          </Box>
                        }
                        sx={{ ml: 2 }}
                      />
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        ₹{item.prodId?.price?.toLocaleString() || 0}
                      </Typography>
                    </ListItem>
                    {index < selectedOrder.orderItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDetailsOpen(false)} startIcon={<ArrowBack />}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
              }
            }}
          >
            Download Invoice
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderSummaryCards = () => {
    const summary = getOrderSummary();
    
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Orders', value: summary.total, icon: <Receipt />, color: '#1976d2' },
          { title: 'Pending Orders', value: summary.pending, icon: <Pending />, color: '#ed6c02' },
          { title: 'Delivered Orders', value: summary.delivered, icon: <CheckCircle />, color: '#2e7d32' },
          { title: 'Total Spent', value: `₹${summary.totalSpent.toLocaleString()}`, icon: <AttachMoney />, color: '#9c27b0' }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Fade in timeout={800 + index * 200}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}25 100%)`,
                  border: `2px solid ${stat.color}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 25px ${stat.color}30`
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ color: stat.color, fontSize: 40 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Grid item xs={12} sm={6} md={4} key={n}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} />
                  <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage all your orders in one place
        </Typography>
      </Box>

      {allOrders.length === 0 ? (
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)'
          }}
        >
          <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            No Orders Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You haven't placed any orders yet. Start shopping to see your orders here.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.href = '/products'}
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
      ) : (
        <>
          {/* Summary Cards */}
          {renderSummaryCards()}

          {/* Filters and Search */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    {orderStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="amount-high">Amount: High to Low</MenuItem>
                    <MenuItem value="amount-low">Amount: Low to High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Orders Grid */}
          <Grid container spacing={3}>
            {filteredOrders.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order._id}>
                {renderOrderCard(order)}
              </Grid>
            ))}
          </Grid>

          {filteredOrders.length === 0 && allOrders.length > 0 && (
            <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No orders match your current filters
              </Typography>
              <Button
                variant="text"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setSortBy('newest');
                }}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Paper>
          )}
        </>
      )}

      {/* Order Details Modal */}
      {renderOrderDetails()}
    </Container>
  );
};

export default Orders;
