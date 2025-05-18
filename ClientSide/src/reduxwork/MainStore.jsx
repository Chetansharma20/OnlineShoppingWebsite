import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './CartSlice'
import userLogin from './UserSlice'

let MainStore = configureStore({
    reducer: {
        cart: cartReducer,
      user:userLogin
    }
})
export default  MainStore