import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Menu from "./Menu";
import Footer from "./Footer";
import styles from "../styles/Layout.module.css";

const Layout = () => {
  const location = useLocation();
  const authRoutes = ["/auth/login", "/auth/register", "/auth/reset-password/:token", "/auth/forgot-password"];

  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {!isAuthRoute && <Menu />}
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </div>
      {!isAuthRoute && <Footer />}
    </div>
  );
};

export default Layout;


