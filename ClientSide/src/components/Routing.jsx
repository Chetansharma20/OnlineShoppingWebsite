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
        <Route path='/register' element={<Register/>}/>
        <Route path='/cart' element={
          <ProtectedRoute><Carts/></ProtectedRoute>
          }/>
        <Route path='/profile' element={<Profile/>}/>

    </Routes>
    
    
    
    
    </>
  )
}

export default Routing