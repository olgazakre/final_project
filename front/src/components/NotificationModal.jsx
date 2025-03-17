import React, { useState, useEffect } from 'react';
import styles from '../styles/NotificationModal.module.css';
import api from "../utils/api";
import { useSelector } from 'react-redux'; // Для получения токена

const NotificationModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Добавляем состояние для ошибок
  const user = useSelector((state) => state.auth.user); // Получаем пользователя и токен
  const posts = useSelector((state) => state.posts.posts); // Получаем все посты из Redux

  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        setLoading(true);
        setError(null); // Сбрасываем ошибку перед новым запросом
        try {
          const token = user?.token || localStorage.getItem("token"); // Используем токен из Redux или localStorage
          
          if (!token) {
            console.error('Токен отсутствует');
            setError('Пожалуйста, авторизируйтесь');
            return;
          }

          const response = await api.get('/notification', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = response.data; // axios сам парсит данные
          console.log(data)
          setNotifications(data);
        } catch (error) {
          console.error('Ошибка при получении уведомлений:', error);
          setError('Ошибка при получении уведомлений');
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [isOpen, user]);

  // Отметить все уведомления как прочитанные
  const handleMarkAllAsRead = async () => {
    try {
      const token = user?.token || localStorage.getItem("token");

      if (!token) {
        console.error('Токен отсутствует');
        setError('Пожалуйста, авторизируйтесь');
        return;
      }

      await api.put('/notification/mark-as-read', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // После успешного запроса, очищаем уведомления
      setNotifications([]);
    } catch (error) {
      console.error('Ошибка при отметке всех уведомлений как прочитанных:', error);
      setError('Ошибка при отметке всех уведомлений как прочитанных');
    }
  };

  // Получаем пост по id
  const getPostById = (postId) => {
    return posts.find(post => post._id === postId); // Поиск поста по id
  };

  if (!isOpen) return null;


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Новые уведомления</h2>

        {loading ? (
          <p className={styles.loading}>Загрузка уведомлений...</p>
        ) : (
          <>
            {error && <p className={styles.error}>{error}</p>} {/* Отображаем сообщение об ошибке */}
            <ul className={styles.notificationList}>
              {notifications.length === 0 ? (
                <p>Нет новых уведомлений</p>
              ) : (
                notifications.map((notification) => {
                  const post = getPostById(notification.postId); // Получаем пост из состояния по его id

                  return (
                    <li key={notification._id} className={styles.notificationItem}>
                      {/* Изображение пользователя (если есть в формате base64) */}
                      <img
                        src={notification.sender.avatar} // Используем base64 строку
                        alt={notification.sender.username}
                        className={styles.avatar}
                      />
                      <div className={styles.notificationInfo}>
                        <p>
                          <strong>{notification.sender.username}</strong> {notification.action}
                        </p>
                        <p className={styles.typetamp}>
                          <strong>{notification.type}</strong> {notification.action}
                        </p>
                        <p className={styles.timestamp}>
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Изображение поста (если есть в формате base64) */}
                      {post && post.image && (
                        <img
                          src={post.image} // Используем base64 строку для изображения поста
                          alt="Изображение поста"
                          className={styles.postImage}
                        />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
            {notifications.length > 0 && (
              <button
                className={styles.markAllButton}
                onClick={handleMarkAllAsRead}
              >
                Отметить все как прочитанные
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
