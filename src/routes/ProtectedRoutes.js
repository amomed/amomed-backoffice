import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import Login from '../pages/Login';
// -------------------------------------------------

// AUTHENTICATION PROTECTION
const AuthRouter = ({isAuth}) => {
    const location = useLocation();
     return isAuth
    ? <Navigate to='/' state={{ from: location }} /> 
    : <Outlet/>
}

export { AuthRouter }