

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api"; // Предположим, что api.js содержит функции для запросов

const Profile = () => {
  const { userId } = useParams(); // Получаем userId из URL
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${userId}`); // Запрос к серверу для получения данных пользователя
        setUser(response.data); // Сохраняем данные пользователя
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return <div>Загрузка...</div>; // Показываем индикатор загрузки, пока данные пользователя не загружены
  }

  return (
    <div>
      <h1>{user.username}</h1>
      <img src={user.avatar} alt="Avatar" />
      <p>{user.bio}</p> {/* Пример вывода информации о пользователе */}
    </div>
  );
};

export default Profile;
