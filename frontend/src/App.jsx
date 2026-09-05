
import React, { useEffect } from "react";
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Products from './pages/Products';
import Register from './User/Register';
import Login from './User/Login';
import Profile from './User/Profile';
import ProtectedRoutes from './components/ProtectedRoutes';
import UpdateProfile from './User/UpdateProfile';
import UpdatePassword from './User/UpdatePassword';
import ForgotPassword from './User/ForgotPassword';
import ResetPassword from './User/ResetPassword';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import OrderConfirm from './pages/OrderConfirm';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './admin/Dashboard';
import ProductsList from './admin/ProductsList';
import CreateProduct from './admin/CreateProduct';
import UpdateProduct from './admin/UpdateProduct';
import OrdersList from './admin/OrdersList';
import UpdateOrder from './admin/UpdateOrder';
import UsersList from './admin/UsersList';
import UpdateRole from './admin/UpdateRole';
import ReviewsList from './admin/ReviewsList';
import { useDispatch } from "react-redux";
import { loadUser } from "./User/userSlice";
function App(){
  const dispatch=useDispatch()
  useEffect(()=>{
    // Always attempt to restore the session from the auth cookie on load —
    // isAuthenticated starts false on every fresh page load, so gating this
    // on isAuthenticated meant the session was never actually restored.
    dispatch(loadUser())
  },[dispatch])
  return(
   <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/product/:id" element={<ProductDetails/>}/>
      <Route path="/products" element={<Products/>}/>
      <Route path="/products/:keyword" element={<Products/>}/>
      <Route path="/register" element={<Register/>}/>
           <Route path="/login" element={<Login/>}/>
            <Route path="/profile/update" element={<ProtectedRoutes element={<UpdateProfile/>}/>}/>
             <Route path="/password/update" element={<ProtectedRoutes element={<UpdatePassword/>}/>}/>
           <Route path="/profile" element={<ProtectedRoutes element={<Profile/>}/>}/>
           <Route path="/password/forgot" element={<ForgotPassword/>}/>
             <Route path="/reset/:token" element={<ResetPassword/>}/>

      {/* Cart & checkout */}
      <Route path="/cart" element={<ProtectedRoutes element={<Cart/>}/>}/>
      <Route path="/shipping" element={<ProtectedRoutes element={<Shipping/>}/>}/>
      <Route path="/order/confirm" element={<ProtectedRoutes element={<OrderConfirm/>}/>}/>
      <Route path="/process/payment" element={<ProtectedRoutes element={<Payment/>}/>}/>
      <Route path="/paymentsuccess" element={<ProtectedRoutes element={<PaymentSuccess/>}/>}/>

      {/* Orders */}
      <Route path="/orders/user" element={<ProtectedRoutes element={<MyOrders/>}/>}/>
      <Route path="/order/:id" element={<ProtectedRoutes element={<OrderDetails/>}/>}/>

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoutes isAdmin={true} element={<AdminDashboard/>}/>}/>
      <Route path="/admin/products" element={<ProtectedRoutes isAdmin={true} element={<ProductsList/>}/>}/>
      <Route path="/admin/product/create" element={<ProtectedRoutes isAdmin={true} element={<CreateProduct/>}/>}/>
      <Route path="/admin/product/:id" element={<ProtectedRoutes isAdmin={true} element={<UpdateProduct/>}/>}/>
      <Route path="/admin/orders" element={<ProtectedRoutes isAdmin={true} element={<OrdersList/>}/>}/>
      <Route path="/admin/order/:id" element={<ProtectedRoutes isAdmin={true} element={<UpdateOrder/>}/>}/>
      <Route path="/admin/users" element={<ProtectedRoutes isAdmin={true} element={<UsersList/>}/>}/>
      <Route path="/admin/user/:id" element={<ProtectedRoutes isAdmin={true} element={<UpdateRole/>}/>}/>
      <Route path="/admin/reviews" element={<ProtectedRoutes isAdmin={true} element={<ReviewsList/>}/>}/>

    </Routes>
   </Router>
  )
}
export default App
