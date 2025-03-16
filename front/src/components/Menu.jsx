import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/Menu.module.css";
import logo from "../assets/ichgram.jpg";
import { Home, Search, Compass, MessageCircle, Bell, PlusCircle, User } from "lucide-react";
import { useSelector } from "react-redux";
import SearchModal from "./SearchModal";
import NotificationModal from "./NotificationModal";


const Menu = () => {
  const user = useSelector((state) => state.auth.user);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const [isNotificationOpen, setNotificationOpen] = useState(false);


  if (!user) {
    return <div>Загрузка...</div>; 
  }

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("data:image")
      ? user.avatar
      : `data:image/jpeg;base64,${user.avatar}`
    : null;

  return (
    <nav className={styles.menu}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>

      <ul className={styles.menuList}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.menuItem} ${activeItem === "home" || isActive ? styles.active : ""}`
            }
            onClick={() => setActiveItem("home")}
          >
            <Home size={24} /> <span>Дом</span>
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
            className={`${styles.menuItem} ${activeItem === "search" ? styles.active : ""}`}
          >
            <Search size={24} /> <span>Поиск</span>
          </a>
        </li>
        <li>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `${styles.menuItem} ${activeItem === "explore" || isActive ? styles.active : ""}`
            }
            onClick={() => setActiveItem("explore")}
          >
            <Compass size={24} /> <span>Интересное</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `${styles.menuItem} ${activeItem === "messages" || isActive ? styles.active : ""}`
            }
            onClick={() => setActiveItem("messages")}
          >
            <MessageCircle size={24} /> <span>Сообщения</span>
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
    className={`${styles.menuItem} ${activeItem === "notifications" ? styles.active : ""}`}
  >
    <Bell size={24} /> <span>Уведомления</span>
  </a>
</li>
        <li>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `${styles.menuItem} ${activeItem === "create" || isActive ? styles.active : ""}`
            }
            onClick={() => setActiveItem("create")}
          >
            <PlusCircle size={24} /> <span>Создать</span>
          </NavLink>
        </li>
      </ul>

      <div className={styles.profileContainer}>
        <NavLink
          to={`/profile/${user.id}`} 
          className={({ isActive }) =>
            `${styles.profileItem} ${activeItem === "profile" || isActive ? styles.active : ""}`
          }
          onClick={() => setActiveItem("profile")} 
        >
          {avatarSrc ? (
            <img src={avatarSrc} alt="Аватар" className={styles.profileImage} />
          ) : (
            <User size={32} className={styles.profileIcon} />
          )}
          <span>Профиль</span>
        </NavLink>
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
    </nav>
  );
};

export default Menu;
