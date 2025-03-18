import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import yourImagePath from "../assets/troubleLogging.svg"; 
import styles from "../styles/RequestPasswordReset.module.css"; 

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("Ссылка для сброса пароля отправлена на email");
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при отправке запроса");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.imageContainer}>
          <img src={yourImagePath} alt="Reset Password" className={styles.image} />
        </div>

        <h1 className={styles.title}>Проблемы со входом?</h1>
        <p>Введите свой адрес электронной почты и мы вышлем Вам ссылку для входа в Вашу учетную запись</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Отправить ссылку для сброса пароля
          </button>
        </form>

        {message && <div className={styles.message}>{message}</div>}

        <div className={styles.separator}>
          <span className={styles.orText}>ИЛИ</span>
        </div>

        <Link to="/auth/register" className={styles.link}>
          Создать новый аккаунт
        </Link>
      </div>

      <div className={styles.loginContainer}>
        <Link to="/auth/login" className={styles.backToLogin}>
          Вернуться к входу
        </Link>
      </div>
    </div>
  );
};

export default RequestPasswordReset;
