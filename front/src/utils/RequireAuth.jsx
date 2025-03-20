import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
