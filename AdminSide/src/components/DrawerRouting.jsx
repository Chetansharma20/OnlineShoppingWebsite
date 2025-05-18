import React from 'react'
import Draweradmin from './Draweradmin'
import { Routes , Route} from 'react-router-dom'
import DashBoard from './DashBoard'
import AddProduct from './AddProduct'
import Orders from './Orders'
import ReviewRatings from './ReviewRatings'
import Products from './Products'
import OrderDetails from './OrderDetails'


const DrawerRouting = () => {
  return (
    <>
   <Draweradmin/>
    <Routes>
<Route path='/' element={<DashBoard/>}/>
<Route path='/addproduct' element={<AddProduct/>}/>
<Route path='/product' element={<Products/>}/>
<Route path='/orders' element={<Orders/>}/>
<Route path='/reviewratings' element={<ReviewRatings/>}/>
<Route path='/orderdetails' element={<OrderDetails/>}/>
    </Routes>
 </>
  )
}

export default DrawerRouting
