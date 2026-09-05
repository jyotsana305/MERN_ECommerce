import React from 'react';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import { Navigate } from 'react-router-dom';
function ProtectedRoutes({element,isAdmin=false}){
    const{isAuthenticated,authChecked,user}=useSelector(state=>state.user);
    // Wait for the initial session-restore (loadUser) to finish before
    // deciding to redirect - otherwise a hard reload of a protected route
    // sees the default isAuthenticated:false and bounces the user to /login
    // before the auth cookie has even been checked.
    // Deliberately NOT checking the generic `loading` flag here - it's
    // shared by every action on this slice (including admin thunks that
    // the protected page itself dispatches after mounting), so gating on
    // it would unmount/remount the page in a loop every time any of those
    // actions goes pending. `authChecked` only tracks the one-time initial
    // session restore, which is all this guard needs.
    if(!authChecked){
        return <Loader/>
    }
    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
    if(isAdmin && user?.role!=='admin'){
        return <Navigate to="/"/>
    }
    return element

}
export default ProtectedRoutes;
