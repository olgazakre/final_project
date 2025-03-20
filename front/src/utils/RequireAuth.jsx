import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    // Если нет токена — редирект на страницу логина
    return <Navigate to="/auth/login" replace />;
  }

  // Если авторизован — рендерим вложенные маршруты
  return <Outlet />;
};

export default RequireAuth;
