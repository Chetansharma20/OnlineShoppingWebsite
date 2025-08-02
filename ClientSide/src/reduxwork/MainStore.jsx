import { combineReducers, configureStore } from "@reduxjs/toolkit"
import cartReducer from './CartSlice';
import userLogin from './UserSlice';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import persistReducer from "redux-persist/es/persistReducer";


const timeoutMiddleware = store=> next => action =>
{
    const result = next(action);
    if (action.type === '/') 
        {
            setTimeout(()=>
            {
                store.dispatch(logout())
            },5000)
        
    }
    return result
}


const persistConfig = {
  key: 'user',
  version:1,
  storage,
}


const rootReducer = combineReducers({
  cart: cartReducer,
  user:userLogin
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const MainStore = configureStore({
  reducer:persistedReducer,
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:[FLUSH, REHYDRATE, PAUSE, PURGE, REGISTER],

      }
    }).concat(timeoutMiddleware)
})
export default MainStore
export const Persistor = persistStore(MainStore)