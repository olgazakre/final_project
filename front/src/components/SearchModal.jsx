import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import api from "../utils/api";
import styles from "../styles/SearchModal.module.css";
import { X, User } from "lucide-react";

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null); 

  const handleSearch = async (e) => {
    const searchText = e.target.value;
    setQuery(searchText);

    if (searchText.trim() === "") {
      setResults([]);
      return;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);

    try {
      const response = await api.get(`/search/users?query=${searchText}`, {
        signal: controller.signal, 
      });
      setResults(response.data);
    } catch (error) {
      if (error.name !== "CanceledError" && error.name !== "AbortError") {
        console.error("Ошибка поиска пользователей:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  const handleLinkClick = () => {
    onClose();
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
          {query && (
            <button onClick={handleClear} className={styles.clearButton}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className={styles.results}>
          {loading ? (
            <p>Загрузка...</p>
          ) : results.length > 0 ? (
            results.map((user) => (
              <NavLink
                key={user._id}
                to={`/profile/${user._id}`}
                className={styles.user}
                onClick={handleLinkClick}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className={styles.avatar} />
                ) : (
                  <User className={styles.avatarIcon} />
                )}
                <p>{user.username}</p>
              </NavLink>
            ))
          ) : (
            query && <p className={styles.noResults}>Пользователи не найдены</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
