import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Импортируем api для запросов
import styles from '../styles/Explore.module.css'; // Подключим стили для компонента

const Explore = () => {
  const [randomPosts, setRandomPosts] = useState([]); // Состояние для случайных постов
  const [loading, setLoading] = useState(true); // Состояние для отслеживания загрузки
  const [error, setError] = useState(null); // Состояние для обработки ошибок

  // Функция для загрузки всех постов и выбора случайных
  const loadPosts = async () => {
    setLoading(true); // Устанавливаем загрузку в true
    try {
      // Запрос на сервер для получения всех постов
      const response = await api.get('/posts');
      const allPosts = response.data; // Получаем все посты

      // Рандомно выбираем 10 постов
      const shuffledPosts = [...allPosts];
      for (let i = shuffledPosts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPosts[i], shuffledPosts[j]] = [shuffledPosts[j], shuffledPosts[i]]; // Перемешиваем посты
      }

      // Оставляем только первые 10 случайных постов
      setRandomPosts(shuffledPosts.slice(0, 10));
    } catch (err) {
        console.error(err)
      setError('Ошибка загрузки постов'); // Если ошибка, сохраняем сообщение
    } finally {
      setLoading(false); // Завершаем загрузку
    }
  };

  useEffect(() => {
    loadPosts(); // Загружаем посты при монтировании компонента
  }, []);

  if (loading) {
    return <div>Загрузка...</div>; // Если идет загрузка
  }

  if (error) {
    return <div>{error}</div>; // Если произошла ошибка
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {randomPosts.map((post) => (
          <div key={post._id} className={styles.card}>
            <img src={post.image} alt={post.title} className={styles.image} />
            <div className={styles.cardContent}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
