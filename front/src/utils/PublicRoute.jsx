import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (token) {
    // Если уже авторизован — отправляем на Home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
