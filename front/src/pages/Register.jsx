import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../utils/api";
import logoImage from "../assets/ichgram.jpg";
import styles from "../styles/Register.module.css"; 

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setUsernameError("");

    try {
      if (password.length < 4) {
        setError("Пароль должен содержать минимум 4 символа");
        return;
      }  
      await api.post("/auth/register", { username, email, password, fullName });
      navigate("/auth/login");
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        const { message } = err.response.data;

        if (message.includes("Email")) {
          setEmailError("Этот email уже используется");
        } else if (message.includes("Username")) {
          setUsernameError("Это имя пользователя уже занято");
        } else {
          setError("Ошибка при регистрации");
        }
      } else {
        setError("Ошибка при регистрации");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <img src={logoImage} alt="Logo" className={styles.logo} />
        </div>

        <h3 className={styles.subtitle}>
          Зарегистрируйтесь, чтобы просматривать фото и видео ваших друзей.
        </h3>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            {emailError && <div className={styles.error}>{emailError}</div>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Полное имя"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
            />
            {usernameError && <div className={styles.error}>{usernameError}</div>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <p className={styles.infoText}>
            Люди, которые пользуются нашим сервисом, могли загрузить ваши
            контактные данные в Instagram.{" "}
            <a href="#">Узнать больше</a>
          </p>

          <p className={styles.termsText}>
            Регистрируясь, вы соглашаетесь с нашими{" "}
            <a href="#">Условиями</a>,{" "}
            <a href="#">Политикой конфиденциальности</a> и{" "}
            <a href="#">Политикой использования файлов cookie</a>.
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button}>
            Зарегистрироваться
          </button>
        </form>
      </div>

      <div className={styles.registerContainer}>
        <p>
          Есть аккаунт?{" "}
          <Link to="/auth/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
