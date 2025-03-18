import React, { useState, useEffect } from 'react';
import styles from '../styles/NotificationModal.module.css';
import api from "../utils/api";
import { useSelector } from 'react-redux';

const NotificationModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const posts = useSelector((state) => state.posts.posts);

  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
          if (!token) {
            console.error('Token отсутствует');
            setError('Пожалуйста, авторизируйтесь');
            return;
          }

          const response = await api.get('/notification', {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log('Уведомления:', response.data);
          setNotifications(response.data);
        } catch (error) {
          console.error('Ошибка при получении уведомлений:', error);

          if (error.response) {
            console.error('Ответ сервера:', error.response.data);
            setError(error.response.data.message || 'Ошибка при получении уведомлений');
          } else if (error.request) {
            console.error('Нет ответа от сервера:', error.request);
            setError('Нет ответа от сервера');
          } else {
            console.error('Ошибка:', error.message);
            setError(error.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [isOpen, token]);

  const handleMarkAllAsRead = async () => {
    try {
      if (!token) {
        console.error('Token отсутствует');
        setError('Пожалуйста, авторизируйтесь');
        return;
      }

      await api.put('/notification/mark-as-read', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications([]);
    } catch (error) {
      console.error('Ошибка при отметке всех уведомлений как прочитанных:', error);

      if (error.response) {
        console.error('Ответ сервера:', error.response.data);
        setError(error.response.data.message || 'Ошибка при отметке уведомлений');
      } else if (error.request) {
        console.error('Нет ответа от сервера:', error.request);
        setError('Нет ответа от сервера');
      } else {
        console.error('Ошибка:', error.message);
        setError(error.message);
      }
    }
  };

  const getPostById = (postId) => {
    return posts.find(post => post._id === postId);
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
            {error && <p className={styles.error}>{error}</p>}
            <ul className={styles.notificationList}>
              {notifications.length === 0 ? (
                <p>Нет новых уведомлений</p>
              ) : (
                notifications.map((notification) => {
                  const post = getPostById(notification.postId);

                  return (
                    <li key={notification._id} className={styles.notificationItem}>
                      <img
                        src={notification.sender.avatar}
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

                      {post && post.image && (
                        <img
                          src={post.image}
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
