import { combineReducers } from "redux";
import login from "./login-reduce.js";
import listProduct from "./product-reduce"
import groupProduct from "./group-product-reduce.js";
import loading from "./loading-reduce"
import orderUser from "./order-reducer"
import groupProductID from './group-product-id-reduce'
import userOrder from './user-order-reducer'
import user from './user-reducer'

const rootReducers = combineReducers({
  login,
  listProduct,
  groupProduct,
  loading,
  orderUser,
  groupProductID,
  userOrder,
  user
  
});

export default rootReducers;
