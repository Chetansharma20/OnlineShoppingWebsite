import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    cartItems:[],
    cartTotalAmount:0,
    cartItemCount: 0
};
let CartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        addItem:(state, actions)=>
        {
            let newItem = {...actions.payload, qty:1 }
            let AllItems = state.cartItems.some((prod)=>prod._id == newItem._id)
            if (!AllItems) 
            {
                state.cartItems = [...state.cartItems, newItem]
                state.cartItemCount = state.cartItems.length
                
            }
            else
            {
                alert("product is already in cart")
            }
           
            
        },
        incrementQty:(state, actions)=>
        {
            let prod = state.cartItems.find((item)=> item.id == actions.payload.pId)
            prod.qty += 1
            

        },
        decrementQty:()=>
        {

            let prod = state.cartItems.find((item)=> item.id == actions.payload.pId)
            if (prod.qty <= 0) 
            {
                state.cartItems = state.cartItems.filter((item)=> item.id != actions.payload.pId)
            }
            else
            {
                prod.qty -= 1
            }

        },
        removeItem:(state, actions)=>
        {
            state.cartItems = state.cartItems.filter((item)=> item.id != actions.payload.pId)

        },
        calculateTotal:(state)=>{
       let totalAmt = 0
     state.cartItems.forEach((item)=>
{
    totalAmt += item.price * item.qty
})
state.cartTotalAmount = totalAmt
        },
     
clearCart:(state)=>
        {
       state.cartItems = []
        }   
    }
})
export const {addItem,removeItem,calculateTotal,incrementQty,decrementQty, clearCart} = CartSlice.actions
export default CartSlice.reducer