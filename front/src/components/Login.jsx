import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Link } from "react-router-dom";
import styles from "../styles/Login.module.css";
import loginImage from "../assets/loginImg.jpg";
import logoImage from "../assets/ichgram.jpg"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      console.error(err)
      setError("Неверные учетные данные");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={loginImage} alt="Login Illustration" className={styles.image} />
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.logoContainer}>
            <img src={logoImage} alt="Logo" className={styles.logo} />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <input
                type="email"
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.button}>
              Войти
            </button>

            <div className={styles.divider}>
              <span className={styles.line}></span>
              <span className={styles.or}>или</span>
              <span className={styles.line}></span>
            </div>

            <div className={styles.links}>
              <Link to="/auth/forgot-password" className={styles.link}>Забыли пароль?</Link>
            </div>
          </form>
        </div>

        <div className={styles.registerContainer}>
          <p>Нет аккаунта? <Link to="/auth/register" className={styles.link}>Зарегистрируйтесь</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
