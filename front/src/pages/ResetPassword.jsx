import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import yourImagePath from "../assets/troubleLogging.svg"; 
import styles from "../styles/ResetPassword.module.css"; 

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setMessage("Пароль успешно обновлен");
      navigate("/auth/login");
    } catch (err) {
        console.error(err)
      setMessage("Ошибка при сбросе пароля");
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.imageContainer}>
                  <img src={yourImagePath} alt="Reset Password" className={styles.image} />
                </div>
      <h1>Введите новый пароль</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Сбросить пароль</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
};

export default ResetPassword;
