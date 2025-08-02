import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { deepOrange } from "@mui/material/colors";
import { useSelector } from "react-redux";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Orders", path: "/orders" },
  { label: "Products", path: "/products" },
  { label: "Register", path: "/register" },
];

const NewAppBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cartItemCount } = useSelector((state) => state.cart);
  const { isLogin, userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#00796b",
          px: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left: Logo + Hamburger (mobile) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Hamburger Icon - visible on xs/sm */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Ecommerce
            </Typography>
          </Box>

          {/* Nav Links - visible on md and up */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {navLinks.map((link) => (
              <ListItem
                key={link.label}
                onClick={() => navigate(link.path)}
                sx={{
                  cursor: "pointer",
                  color: "white",
                  "&:hover": {
                    color: "#ffffff",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </Box>

          {/* Right: Cart + Avatar/Login */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Cart */}
            <ListItem
              onClick={() => navigate("/cart")}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <ListItemText  sx={{ color: "white" }} />
              <ListItemIcon>
                <Badge
                  badgeContent={cartItemCount > 0 ? cartItemCount : null}
                  color="error"
                >
                  <AddShoppingCartIcon sx={{ color: "white" }} />
                </Badge>
              </ListItemIcon>
            </ListItem>

            {/* Avatar/Login */}
            {isLogin ? (
              <Avatar
                onClick={() => navigate("/profile")}
                sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
              >
                {userData?.userName?.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="contained"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#00796b",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#e0f2f1",
                    color: "#00796b",
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {navLinks.map((link) => (
              <ListItem
                button
                key={link.label}
                onClick={() => handleNav(link.path)}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NewAppBar;
