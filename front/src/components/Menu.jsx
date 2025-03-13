import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/Menu.module.css";
import logo from "../assets/ichgram.jpg";
import { Home, Search, Compass, MessageCircle, Bell, PlusCircle, User } from "lucide-react";
import { useSelector } from "react-redux";

const Menu = () => {
  const user = useSelector((state) => state.auth.user);
  console.log("User from Redux:", user);

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("data:image")
      ? user.avatar
      : `data:image/jpeg;base64,${user.avatar}`
    : null;

  if (!user) {
    return <div>Загрузка...</div>;
  }

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
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <Home size={24} /> <span>Дом</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/search" 
            className={({ isActive }) => 
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <Search size={24} /> <span>Поиск</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/explore" 
            className={({ isActive }) => 
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <Compass size={24} /> <span>Интересное</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/messages" 
            className={({ isActive }) => 
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <MessageCircle size={24} /> <span>Сообщения</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/notifications" 
            className={({ isActive }) => 
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <Bell size={24} /> <span>Уведомления</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/create" 
            className={({ isActive }) => 
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <PlusCircle size={24} /> <span>Создать</span>
          </NavLink>
        </li>
      </ul>

      <div className={styles.profileContainer}>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            isActive ? `${styles.profileItem} ${styles.active}` : styles.profileItem
          }
        >
          {avatarSrc ? (
            <img src={avatarSrc} alt="Аватар" className={styles.profileImage} />
          ) : (
            <User size={32} className={styles.profileIcon} />
          )}
          <span>Профиль</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Menu;
