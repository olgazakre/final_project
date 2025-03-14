import React, { useState } from "react";
import api from "../utils/api";
import styles from "../styles/SearchModal.module.css";
import { X, User } from "lucide-react"; // Иконка X для очистки

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState(""); // Состояние для текстового ввода
  const [results, setResults] = useState([]); // Состояние для хранения результатов поиска
  const [loading, setLoading] = useState(false); // Состояние для отслеживания загрузки

  // Функция для обработки ввода текста в поле
  const handleSearch = async (e) => {
    const searchText = e.target.value;
    setQuery(searchText); // Обновляем состояние поля ввода

    if (searchText.trim() === "") {
      setResults([]); // Если поле пустое, очищаем результаты поиска
      return;
    }

    setLoading(true); // Начинаем загрузку данных

    try {
      const response = await api.get(`/search/users?query=${searchText}`);
      setResults(response.data); // Заполняем результаты поиска
    } catch (error) {
      console.error("Ошибка поиска пользователей:", error);
    } finally {
      setLoading(false); // Завершаем загрузку
    }
  };

  // Функция для очистки поля ввода
  const handleClear = () => {
    setQuery(""); // Очищаем поле ввода
    setResults([]); // Очищаем результаты поиска
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Поиск</h2>
          <X className={styles.closeIcon} onClick={onClose} />
        </div>
        
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Введите имя пользователя..."
            value={query}
            onChange={handleSearch}
            className={styles.input}
          />
          {/* Кнопка очистки в виде крестика, отображается, когда есть текст в поле */}
          {query && (
            <button onClick={handleClear} className={styles.clearButton}>
              <X size={16} /> {/* Иконка крестика */}
            </button>
          )}
        </div>

        <div className={styles.results}>
          {loading ? (
            <p>Загрузка...</p> // Показываем "Загрузка...", если идет запрос
          ) : results.length > 0 ? (
            results.map((user) => (
              <div key={user._id} className={styles.user}>
                {/* Проверка на наличие аватара, если его нет - показываем иконку */}
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className={styles.avatar} />
                ) : (
                  <User className={styles.avatarIcon} /> // Показываем иконку User, если аватар отсутствует
                )}
                <p>{user.username}</p>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>Пользователи не найдены</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
