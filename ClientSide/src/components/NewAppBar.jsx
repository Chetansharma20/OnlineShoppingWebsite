import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Paper,
  Autocomplete,
  TextField,
  Popper,
  ClickAwayListener,
  Grow,
  MenuList,
  Slide,
  useScrollTrigger
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { deepOrange, purple } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reduxwork/UserSlice";
import axios from "axios";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Orders", path: "/orders" },
  { label: "Products", path: "/products" },
  // { label: "Register", path: "/register" },
];

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const NewAppBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  const { cartItemCount, cartTotalAmount } = useSelector((state) => state.cart);
  const { isLogin, userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await axios.get("http://localhost:5000/api/fetchproducts");
        setProducts(result.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userData?._id) return;
      try {
        const response = await axios.post('http://localhost:5000/api/fetchwishlistsbyuser', {
          userId: userData._id,
        });
        const wishlistProducts = response.data.data?.products || [];
        setWishlistCount(wishlistProducts.length);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    if (userData?._id) {
      fetchWishlist();
    }
  }, [userData?._id]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setSearchOpen(true);
    } else {
      setSearchResults([]);
      setSearchOpen(false);
    }
  }, [searchTerm, products]);

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setSearchTerm("");
      setSearchOpen(false);
    }
  };

  const handleSearchResultClick = (product) => {
    navigate('/products-details', { state: { product } });
    setSearchTerm("");
    setSearchOpen(false);
  };

  // const handleLogout = () => {
  //   dispatch(logout());
  //   setUserMenuOpen(false);
  //   navigate('/login');
  // };

  
const handleLogout = async () => {
  try {
    // Tell backend to destroy session + clear cookie
    await axios.post(
      "http://localhost:5000/api/logout",
      {},
      { withCredentials: true }
    );

    // Clear Redux state
    dispatch(logout());

    // Redirect to login
    navigate("/login");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
  const handleUserMenuToggle = () => {
    setUserMenuOpen((prevOpen) => !prevOpen);
  };

  const handleUserMenuClose = (event) => {
    if (userMenuRef.current && userMenuRef.current.contains(event.target)) {
      return;
    }
    setUserMenuOpen(false);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6a1b9a 100%)',
            backdropFilter: 'blur(10px)',
            px: { xs: 1, sm: 2 },
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1100
          }}
        >
        <Toolbar sx={{
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 2 },
          minHeight: { xs: 64, sm: 70 },
          py: 1
        }}>
          {/* Left: Logo + Hamburger */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: { xs: "block", md: "none" },
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              onClick={() => navigate('/')}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <ShoppingBagIcon sx={{ fontSize: 28, color: 'white' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  background: 'linear-gradient(45deg, #fff 30%, #e8eaf6 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                ShopEase
              </Typography>
            </Box>
          </Box>

          {/* Middle: Enhanced Search Bar */}
          <Box sx={{ position: 'relative', width: { xs: "100%", sm: "50%", md: "40%" } }}>
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                px: 2,
                py: 0.5,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  transform: 'scale(1.02)',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)'
                },
                '&:focus-within': {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  border: '2px solid #667eea',
                  transform: 'scale(1.02)'
                }
              }}
              ref={searchRef}
            >
              <SearchIcon sx={{ color: "#667eea", mr: 1 }} />
              <InputBase
                placeholder="Search products, categories..."
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                sx={{
                  '& input': {
                    fontSize: '0.95rem',
                    fontWeight: 500
                  }
                }}
              />
              {searchTerm && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchTerm('');
                    setSearchOpen(false);
                  }}
                  sx={{ color: '#999' }}
                >
                  ×
                </IconButton>
              )}
            </Paper>

            {/* Search Results Dropdown */}
            {searchOpen && searchResults.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 1,
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  zIndex: 1300,
                  maxHeight: 400,
                  overflow: 'auto'
                }}
              >
                <List sx={{ py: 0 }}>
                  {searchResults.map((product, index) => (
                    <ListItem
                      key={product._id}
                      onClick={() => handleSearchResultClick(product)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        },
                        borderBottom: index < searchResults.length - 1 ? '1px solid #eee' : 'none'
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          component="img"
                          src={`http://localhost:5000/${product.prodimage}`}
                          sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={product.title}
                        secondary={`₹${product.price} • ${product.category}`}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontSize: '0.9rem',
                            fontWeight: 500
                          },
                          '& .MuiListItemText-secondary': {
                            fontSize: '0.8rem'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          {/* Right: Nav Links + Cart + Auth */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  sx={{
                    color: "white",
                    textTransform: "none",
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Wishlist */}
            <IconButton
              onClick={() => navigate("/wishlist")}
              sx={{
                color: "white",
                borderRadius: 2,
                p: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Badge
                badgeContent={wishlistCount > 0 ? wishlistCount : null}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#ff6b9d',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    minWidth: 18,
                    height: 18
                  }
                }}
              >
                <FavoriteIcon />
              </Badge>
            </IconButton>

            {/* Shopping Cart */}
            <Box sx={{ position: 'relative' }}>
              <IconButton
                onClick={() => navigate("/cart")}
                sx={{
                  color: "white",
                  borderRadius: 2,
                  p: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Badge
                  badgeContent={cartItemCount > 0 ? cartItemCount : null}
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#ff4444',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      minWidth: 18,
                      height: 18
                    }
                  }}
                >
                  <AddShoppingCartIcon />
                </Badge>
              </IconButton>
              {cartItemCount > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    fontSize: '0.7rem',
                    opacity: 0.8,
                    whiteSpace: 'nowrap'
                  }}
                >
                  ₹{cartTotalAmount?.toLocaleString() || 0}
                </Typography>
              )}
            </Box>

            {/* User Authentication */}
            {isLogin ? (
              <Box ref={userMenuRef}>
                <Avatar
                  onClick={handleUserMenuToggle}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    cursor: "pointer",
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  {userData?.userName?.charAt(0).toUpperCase()}
                </Avatar>
                <Popper
                  open={userMenuOpen}
                  anchorEl={userMenuRef.current}
                  placement="bottom-end"
                  transition
                  disablePortal
                  sx={{ zIndex: 1300 }}
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps} timeout={200}>
                      <Paper
                        sx={{
                          mt: 1,
                          minWidth: 200,
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <ClickAwayListener onClickAway={handleUserMenuClose}>
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                navigate('/profile');
                                setUserMenuOpen(false);
                              }}
                              sx={{ gap: 2, py: 1.5 }}
                            >
                              <PersonIcon fontSize="small" />
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {userData?.userName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  View Profile
                                </Typography>
                              </Box>
                            </MenuItem>
                            <Divider />
                            <MenuItem
                              onClick={() => {
                                navigate('/orders');
                                setUserMenuOpen(false);
                              }}
                              sx={{ gap: 2, py: 1 }}
                            >
                              <ShoppingBagIcon fontSize="small" />
                              My Orders
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                navigate('/wishlist');
                                setUserMenuOpen(false);
                              }}
                              sx={{ gap: 2, py: 1 }}
                            >
                              <FavoriteIcon fontSize="small" />
                              My Wishlist
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                navigate('/cart');
                                setUserMenuOpen(false);
                              }}
                              sx={{ gap: 2, py: 1 }}
                            >
                              <AddShoppingCartIcon fontSize="small" />
                              Shopping Cart
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout} sx={{ gap: 2, py: 1, color: 'error.main' }}>
                              <LogoutIcon fontSize="small" />
                              Logout
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Box>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="contained"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: 'blur(10px)',
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(255, 255, 255, 0.3)'
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />

      {/* Enhanced Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }
        }}
      >
        <Box sx={{ width: 280 }} role="presentation">
          {/* Drawer Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <ShoppingBagIcon sx={{ fontSize: 32 }} />
              <Typography variant="h5" fontWeight="bold">
                ShopEase
              </Typography>
            </Box>
            {isLogin && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {userData?.userName?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {userData?.userName}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Welcome back!
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Navigation Links */}
          <List sx={{ pt: 2 }}>
            {navLinks.map((link) => (
              <ListItem
                key={link.label}
                onClick={() => handleNav(link.path)}
                sx={{
                  cursor: 'pointer',
                  mx: 1,
                  mb: 1,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(8px)'
                  }
                }}
              >
                <ListItemText
                  primary={link.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                      fontSize: '1.1rem'
                    }
                  }}
                />
              </ListItem>
            ))}

            {/* Additional Mobile Options */}
            {isLogin && (
              <>
                <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <ListItem
                  onClick={() => handleNav('/wishlist')}
                  sx={{
                    cursor: 'pointer',
                    mx: 1,
                    mb: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Badge badgeContent={wishlistCount} sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#ff6b9d'
                      }
                    }}>
                      <FavoriteIcon sx={{ color: 'white' }} />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="My Wishlist" />
                </ListItem>
                <ListItem
                  onClick={() => handleNav('/cart')}
                  sx={{
                    cursor: 'pointer',
                    mx: 1,
                    mb: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Badge badgeContent={cartItemCount} color="error">
                      <AddShoppingCartIcon sx={{ color: 'white' }} />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Shopping Cart" />
                </ListItem>
                <ListItem
                  onClick={handleLogout}
                  sx={{
                    cursor: 'pointer',
                    mx: 1,
                    mb: 1,
                    borderRadius: 2,
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: 'inherit' }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NewAppBar;
