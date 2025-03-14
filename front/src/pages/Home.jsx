import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";
import Post from "../components/Post";
import { CheckCircle } from "lucide-react"; // Импорт иконки
import styles from "../styles/Home.module.css";

const Home = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // Состояние для отслеживания загрузки
  const isFetching = useRef(false);

  const loadPosts = useCallback(async () => {
    if (!currentUser || isFetching.current) return;

    isFetching.current = true;
    setLoading(true); // Начинаем загрузку

    try {
      const postsResponse = await api.get(`/posts?page=${page}&limit=6`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const allPosts = postsResponse.data || [];
      console.log(allPosts);

      setPosts((prevPosts) => {
        const uniquePosts = [...prevPosts, ...allPosts].filter(
          (post, index, self) => self.findIndex((p) => p._id === post._id) === index
        );
        return uniquePosts;
      });
      

      // Если загруженные посты меньше, чем лимит, то нет больше постов
      if (allPosts.length < 6) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Ошибка загрузки постов:", error);
    } finally {
      isFetching.current = false;
      setLoading(false); // Завершаем загрузку
    }
  }, [currentUser, page]);

  useEffect(() => {
    if (currentUser) {
      loadPosts();
    }
  }, [currentUser, loadPosts, page]);

  return (
    <div className={styles.container}>
      {/* Контейнер с постами */}
      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : posts.length > 0 ? (
        posts.map((post, index) => (
          <div key={post._id || `post-${index}`}>
            <Post post={post} />
          </div>
        ))
      ) : (
        <p className={styles.noPosts}>Нет постов</p>
      )}
  
      {/* Контейнер для кнопки загрузки дополнительных постов */}
      <div className={styles.loadMoreContainer}>
        {!loading && hasMore && (
          <button
            className={styles.loadMore}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Показать ещё
          </button>
        )}
      </div>
  
      {/* Надпись "Это все посты" в центре, если больше нет постов */}
      {!loading && !hasMore && posts.length > 0 && (
        <div className={styles.noMorePosts}>
          <CheckCircle className={styles.checkIcon} />
          <span>Это все посты</span>
        </div>
      )}
    </div>
  );
};  

export default Home;


