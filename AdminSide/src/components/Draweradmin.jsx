import { Box, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { current } from '@reduxjs/toolkit'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ReviewsIcon from '@mui/icons-material/Reviews';
const Draweradmin = () => {
    const[isDrawerOpen, setisDrawerOpen] = useState(false)
    let handleDrawerOpen = ()=>
    {
        setisDrawerOpen(true)
    }
   let handleDrawerClose = ()=>
   {
    setisDrawerOpen(false)
   }
   let navigate = useNavigate();
        
        

  return (
  <>
  <Box sx={{width:'100%', backgroundColor:'GrayText', display:'flex', alignItems:'center'}}>

   <IconButton size="large" edge="start" color="inherit" aria-label="menu"  onClick={()=>{handleDrawerOpen()}}>
   
<ListIcon/>



</IconButton>
Ecommerce
</Box>
<Drawer open={isDrawerOpen} onClose={handleDrawerClose} sx={{cursor:'pointer'}}>
    <List>
<ListItem onClick={()=> {navigate('/')
    handleDrawerClose()
}}>

   <ListItemIcon>
   <DashboardIcon/>
   </ListItemIcon>
    <ListItemText>
DashBoard
    </ListItemText>


</ListItem>
<ListItem onClick={()=> {navigate('/addproduct')
    handleDrawerClose()
}}>

   <ListItemIcon>
<AddIcon/>
   </ListItemIcon>
    <ListItemText>
        AddProduct
    </ListItemText>


</ListItem>
<ListItem onClick={()=> {navigate('/product')
    handleDrawerClose()
}}>

   <ListItemIcon>
<ShoppingCartIcon/>
   </ListItemIcon>
    <ListItemText>
        Products
    </ListItemText>


</ListItem>
<ListItem onClick={()=> {navigate('/orders')
    handleDrawerClose()
}}>

   <ListItemIcon>
   <ViewStreamIcon/>
   </ListItemIcon>
    <ListItemText>
        Orders
    </ListItemText>


</ListItem>
<ListItem onClick={()=> {navigate('/reviewratings')
    handleDrawerClose()
}}>

   <ListItemIcon>
<ReviewsIcon/>
   </ListItemIcon>
    <ListItemText>
        ReviewRatings
    </ListItemText>


</ListItem>


    </List>

</Drawer>
</>

  )
}

export default Draweradmin

