
import React, { Profiler, useEffect } from "react";
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails'; 
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Products from './pages/Products';
import Register from './User/Register';
import Login from './User/Login';
import Profile from './User/Profile';
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./User/userSlice";
function App(){
  const {isAuthenticated,user}=useSelector(state=>state.user);
  const dispatch=useDispatch()
  useEffect(()=>{
    if(isAuthenticated){
      dispatch(loadUser())
    }
  },[dispatch])
  console.log(isAuthenticated,user);
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

    </Routes>

    {isAuthenticated && <UserDashbord user={user}/>}
   </Router>
  )
}
export default App