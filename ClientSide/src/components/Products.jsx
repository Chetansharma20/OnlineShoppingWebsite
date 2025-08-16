import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  CardActions,
  Container,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  IconButton,
  Paper,
  Tooltip,
  Alert,
  Collapse,
  Skeleton,
  Zoom,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
  Breadcrumbs,
  Link
} from "@mui/material";
import {
  Search,
  GridView,
  ViewList,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Visibility,
  Clear,
  TuneRounded,
  ExpandMore,
  ArrowUpward
} from "@mui/icons-material";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { addItem } from "../reduxwork/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const Products = () => {
    const [avgRating, setAvgRating] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [favorites, setFavorites] = useState(new Set());
  const [alert, setAlert] = useState({ show: false, message: "", severity: "success" });
    const [reviewCount, setReviewCount] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLogin, userData } = useSelector((state) => state.user);

  // Get unique categories and brands
  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map((p) => p.category))].filter(Boolean);
    return ["All", ...cats];
  }, [allProducts]);

  const brands = useMemo(() => {
    const brandSet = [...new Set(allProducts.map((p) => p.brand))].filter(Boolean);
    return ["All", ...brandSet];
  }, [allProducts]);

  // Derive max price from all products
  const maxPrice = useMemo(() => {
    if (allProducts.length === 0) return 100000;
    return Math.max(...allProducts.map((p) => p.price));
  }, [allProducts]);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/fetchproducts");
        const products = res.data || [];
        setAllProducts(products);
        if (products.length > 0) {
          const maxP = Math.max(...products.map((p) => p.price));
          setPriceRange([0, maxP]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setAlert({
          show: true,
          message: "Failed to load products. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch user wishlist on userData load
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/fetchwishlistsbyuser", {
          userId: userData?._id,
        });
        const wishlistItems = res.data.data?.products?.map((prod) => prod._id) || [];
        setFavorites(new Set(wishlistItems));
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    if (userData?._id) fetchWishlist();
  }, [userData?._id]);

  // Synchronize filtered products on filters change
  useEffect(() => {
    let filtered = [...allProducts];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (brandFilter !== "All") {
      filtered = filtered.filter((p) => p.brand === brandFilter);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title?.localeCompare(b.title) || 0;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [allProducts, searchTerm, categoryFilter, brandFilter, sortBy, priceRange]);

  // Handle add to cart
  const handleAddToCart = (prod) => {
    if (!isLogin) {
      setAlert({
        show: true,
        message: "Please login first to add items to cart.",
        severity: "warning",
      });
      navigate("/login");
      return;
    }
    dispatch(addItem(prod));
    setAlert({
      show: true,
      message: `${prod.title} added to cart!`,
      severity: "success",
    });
  };

  // Toggle favorite (wishlist)
  const toggleFavorite = async (productId) => {
    if (!isLogin) {
      setAlert({
        show: true,
        message: "Please login first to manage wishlist.",
        severity: "warning",
      });
      navigate("/login");
      return;
    }
    try {
      const updatedFavorites = new Set(favorites);
      if (updatedFavorites.has(productId)) {
        await axios.post("http://localhost:5000/api/deletewishlist", {
          userId: userData._id,
          productId,
        });
        updatedFavorites.delete(productId);
      } else {
        await axios.post("http://localhost:5000/api/createwishlist", {
          userId: userData._id,
          productId,
        });
        updatedFavorites.add(productId);
      }
      // Always set new Set instance for React to detect changes
      setFavorites(new Set(updatedFavorites));
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      setAlert({
        show: true,
        message: "Failed to update wishlist. Please try again.",
        severity: "error",
      });
    }
  };


  
  
  // review avg
useEffect(() => {
  if (allProducts.length === 0) return;

  const fetchAllAvgRatings = async () => {
    const ratings = {};

    for (const product of allProducts) {
      try {
        const res = await axios.post("http://localhost:5000/api/fetchavgreviews", {
          productId: product._id,
        });

        ratings[product._id] = {
          avgRating: res.data.avgRating || 0,
          reviewCount: res.data.count || 0,
        };
      } catch (err) {
        ratings[product._id] = { avgRating: 0, reviewCount: 0 };
      }
    }

    setAvgRating(ratings);
  };

  fetchAllAvgRatings();
}, [allProducts]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setBrandFilter("All");
    setPriceRange([0, maxPrice]);
    setSortBy("name");
  };

  // Render Filters UI
  const renderFilters = () => (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TuneRounded color="primary" />
          Filters & Search
        </Typography>
        <Button variant="outlined" size="small" startIcon={<Clear />} onClick={clearFilters}>
          Clear All
        </Button>
      </Box>

      <Grid container spacing={3} alignItems="center">
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search products..."
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

        {/* Category Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} label="Category">
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Brand Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Brand</InputLabel>
            <Select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} label="Brand">
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Sort */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
              <MenuItem value="name">Name A-Z</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="newest">Newest First</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* View Toggle */}
        <Grid item xs={12} sm={6} md={2}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newView) => newView && setViewMode(newView)}
            fullWidth
          >
            <ToggleButton value="grid">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {/* Price Range */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body1" fontWeight="bold">
                Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={maxPrice}
                step={100}
                marks={[
                  { value: 0, label: "₹0" },
                  { value: maxPrice / 2, label: `₹${(maxPrice / 2).toLocaleString()}` },
                  { value: maxPrice, label: `₹${maxPrice.toLocaleString()}` },
                ]}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Paper>
  );

  // Render a single product card
  const renderProductCard = (prod, index) => (

    

    <Zoom in timeout={600 + index * 100} key={prod._id}>
      <Grid
        item
        xs={12}
        sm={6}
        md={viewMode === "grid" ? 4 : 12}
        lg={viewMode === "grid" ? 3 : 12}
      >
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: viewMode === "list" ? "row" : "column",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "visible",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: 6,
              "& .product-actions": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          {/* Favorite toggle button */}
          <Tooltip title={favorites.has(prod._id) ? "Remove from Wishlist" : "Add to Wishlist"}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(prod._id);
              }}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 2,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  transform: "scale(1.1)",
                },
              }}
            >
              {favorites.has(prod._id) ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>

          <CardMedia
            sx={{
              height: viewMode === "grid" ? 250 : 200,
              width: viewMode === "list" ? 200 : "100%",
              cursor: "pointer",
            }}
            image={`http://localhost:5000/${prod.prodimage}`}
            title={prod.title}
            onClick={() => navigate("/products-details", { state: { product: prod } })}
          ></CardMedia>

          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: "pointer",
                "&:hover": { color: "primary.main" },
              }}
              onClick={() => navigate("/products-details", { state: { product: prod } })}
              title={prod.title}
            >
              {prod.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Chip label={prod.category} size="small" variant="outlined" />
              {prod.brand && <Chip label={prod.brand} size="small" color="primary" />}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={avgRating[prod._id]?.avgRating || 0} size="small" precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({(avgRating[prod._id]?.avgRating || 0)} from {avgRating[prod._id]?.reviewCount || 0} review
                {avgRating[prod._id]?.reviewCount !== 1 ? "s" : ""})
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: prod.price > 15000 ? "error.main" : "primary.main" }}
              >
                ₹{prod.price?.toLocaleString()}
              </Typography>

              <Chip
                label={prod.isAvailable ? "In Stock" : "Out of Stock"}
                color={prod.isAvailable ? "success" : "error"}
                size="small"
              />
            </Box>

            {viewMode === "list" && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                High-quality {prod.category?.toLowerCase()} from {prod.brand} with excellent features and reliable
                performance.
              </Typography>
            )}
          </CardContent>

          <CardActions sx={{ p: 3, pt: 0 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCart />}
              onClick={() => handleAddToCart(prod)}
              disabled={!prod.isAvailable}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": { background: "linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)" },
                "&:disabled": { background: "rgba(0, 0, 0, 0.12)" },
              }}
            >
              {prod.isAvailable ? "Add to Cart" : "Out of Stock"}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Zoom>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card>
                <Skeleton variant="rectangular" height={250} />
                <CardContent>
                  <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} />
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
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      </Collapse>

      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
          Home
        </Link>
        <Typography color="text.primary">Products</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Our Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover amazing products at unbeatable prices. {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"} available.
        </Typography>
      </Box>

      {/* Filters */}
      {renderFilters()}

      {/* Results Summary */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6">
          {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"} Found
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {(searchTerm || categoryFilter !== "All" || brandFilter !== "All") && (
            <Button variant="outlined" size="small" startIcon={<Clear />} onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </Box>
      </Box>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <Grid container spacing={3}>{filteredProducts.map((prod, index) => renderProductCard(prod, index))}</Grid>
      ) : (
        <Paper
          sx={{
            p: 8,
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)",
          }}
        >
          <Search sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            No Products Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria or browse our categories.
          </Typography>
          <Button
            variant="contained"
            onClick={clearFilters}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": { background: "linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)" },
            }}
          >
            Clear Filters
          </Button>
        </Paper>
      )}

      {/* Scroll to Top FAB */}
      <Fab
        color="primary"
        size="medium"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)",
          },
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUpward />
      </Fab>
    </Container>
  );
};

export default Products;
