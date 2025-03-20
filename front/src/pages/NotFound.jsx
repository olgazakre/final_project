import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/NotFound.module.css";
import loginImg from "../assets/loginImg.jpg";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={loginImg} alt="Not Found" className={styles.image} />
      </div>
      <div className={styles.textContainer}>
        <h1>Упс! Страница не найдена (Ошибка 404)</h1>
        <p>
          Извините, но страница которую вы ищете похоже не существует.
          <br />
          Если вы ввели URL вручную, пожалуйста, проверьте правильность написания.
          <br />
          Если вы нажали на ссылку, она может быть устаревшей или еще неработающей.
        </p>
        <Link to="/">Вернуться на главную</Link>
      </div>
    </div>
  );
};

export default NotFound;
