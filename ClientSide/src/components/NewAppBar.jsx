import { AppBar, Avatar, Box, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Toolbar } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { deepOrange } from '@mui/material/colors';
import { useSelector } from 'react-redux';
import Badge from '@mui/material/Badge';

const NewAppBar = () => {
    let { cartItemCount } = useSelector((state) => state.cart);
    let navigate = useNavigate();

    const { isLogin, userData } = useSelector((state) => state.user);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ backgroundColor: "#00796b", px: 2, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

                        {/* Left Section (Navigation links) */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <List sx={{ display: 'flex', gap: 3 }}>
                                <ListItem onClick={() => navigate("/")} sx={{ cursor: 'pointer', "&:hover": { color: "#ffffff", transform: "scale(1.05)" } }}>
                                    <ListItemText primary="Home" sx={{ color: 'white' }} />
                                </ListItem>

                                <ListItem onClick={() => navigate("/orders")} sx={{ cursor: 'pointer', "&:hover": { color: "#ffffff", transform: "scale(1.05)" } }}>
                                    <ListItemText primary="Orders" sx={{ color: 'white' }} />
                                </ListItem>

                                <ListItem onClick={() => navigate("/products")} sx={{ cursor: 'pointer', "&:hover": { color: "#ffffff", transform: "scale(1.05)" } }}>
                                    <ListItemText primary="Products" sx={{ color: 'white' }} />
                                </ListItem>

                                <ListItem onClick={() => navigate("/register")} sx={{ cursor: 'pointer', "&:hover": { color: "#ffffff", transform: "scale(1.05)" } }}>
                                    <ListItemText primary="Register" sx={{ color: 'white' }} />
                                </ListItem>
                            </List>
                        </Box>

                        {/* Right Section (Cart, Avatar/Login) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                            {/* Cart Icon */}
                            <ListItem onClick={() => navigate("/cart")} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', "&:hover": { transform: "scale(1.05)" } }}>
                                <ListItemText primary="Cart" sx={{ color: 'white' }} />
                                <ListItemIcon>
                                    <Badge badgeContent={cartItemCount} color="error">
                                        <AddShoppingCartIcon sx={{ color: 'white' }} />
                                    </Badge>
                                </ListItemIcon>
                            </ListItem>

                            {/* Avatar or Login Button */}
                            <List sx={{ position: 'relative' }}>
                                {isLogin ? (
                                    <Avatar onClick={() => navigate('/profile')} sx={{ bgcolor: deepOrange[500], cursor: 'pointer' }}>
                                        {userData?.userName.charAt(0).toUpperCase()}
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
                                                color: "#00796b"
                                            }
                                        }}
                                    >
                                        Login
                                    </Button>
                                )}
                            </List>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
}

export default NewAppBar;
