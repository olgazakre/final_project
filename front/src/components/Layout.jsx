import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Menu from "./Menu";
import styles from "../styles/Layout.module.css";

const Layout = () => {
  const location = useLocation();
  const authRoutes = ["/auth/login", "/auth/register", "/auth/reset-password/:token", "/auth/forgot-password"];

  return (
    <div className={styles.container}>
      {!authRoutes.includes(location.pathname) && <Menu />}
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
