import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Orders from './Orders'
import Products from './Products'
// import { AppBar } from '@mui/material'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import NewAppBar from './NewAppBar'
import Carts from './Carts'
import Profile from './Profile'
import ProtectedRoute from '../custom/ProtectedRoute'
import ProductDetails from './ProductDetails'
import WishList from './WishList'
import CompleteProfile from './CompleteProfile'
import Checkout from './Checkout'
import Payment from './Payment'
// import GoogleCallback from './GoogleCallback'
const Routing = () => {
  return (
    <>
    <NewAppBar/>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/orders' element={<ProtectedRoute>
          <Orders/>
          </ProtectedRoute>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/products-details' element={<ProductDetails/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/cart' element={
          <ProtectedRoute><Carts/></ProtectedRoute>
          }/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/wishlist' element={<ProtectedRoute>
          <WishList/>
          </ProtectedRoute>}/>

         <Route path='/completeprofile' element={<CompleteProfile/>}/> 
         
         <Route path='/checkout' element={<Checkout/>}/> 
            <Route path='/payment' element={<Payment/>}/>
{/* <Route path='/google-callback' element={<GoogleCallback/>}/> */}
    </Routes>
    
    
    
    
    </>
  )
}

export default Routing