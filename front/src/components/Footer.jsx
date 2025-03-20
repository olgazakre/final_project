import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/Footer.module.css";
import logo from "../assets/ichgram.jpg";
import SearchModal from "./SearchModal";
import NotificationModal from "./NotificationModal";
import CreatePostModal from "./CreatePostModal";

const Footer = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const handlePostSubmit = (postData) => {
    console.log("Новый пост из футера:", postData);
  };

  return (
    <footer className={styles.footer}>
      <ul className={styles.footerMenu}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.footerItem} ${activeItem === "home" || isActive ? styles.active : ""}`
            }
            onClick={() => setActiveItem("home")}
          >
            <span>Дом</span>
          </NavLink>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSearchOpen(true);
              setActiveItem("search");
            }}
            className={`${styles.footerItem} ${activeItem === "search" ? styles.active : ""}`}
          >
            <span>Поиск</span>
          </a>
        </li>
        <li>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `${styles.footerItem} ${activeItem === "explore" || isActive ? styles.active : ""}`
            }
            onClick={() => setActiveItem("explore")}
          >
            <span>Интересное</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `${styles.footerItem} ${activeItem === "messages" || isActive ? styles.active : ""}`
            }
            onClick={() => setActiveItem("messages")}
          >
            <span>Сообщения</span>
          </NavLink>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setNotificationOpen(true);
              setActiveItem("notifications");
            }}
            className={`${styles.footerItem} ${activeItem === "notifications" ? styles.active : ""}`}
          >
            <span>Уведомления</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCreatePostOpen(true);
              setActiveItem("create");
            }}
            className={`${styles.footerItem} ${activeItem === "create" ? styles.active : ""}`}
          >
            <span>Создать</span>
          </a>
        </li>
      </ul>

      <div className={styles.footerBottom}>
        <img src={logo} alt="Logo" className={styles.footerLogo} />
        <p>© 2025</p>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          setSearchOpen(false);
          setActiveItem("");
        }}
      />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => {
          setNotificationOpen(false);
          setActiveItem("");
        }}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => {
          setCreatePostOpen(false);
          setActiveItem("");
        }}
        onPostSubmit={handlePostSubmit}
      />
    </footer>
  );
};

export default Footer;
