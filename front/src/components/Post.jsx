import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost } from "../redux/postSlice"; 
import api from "../utils/api"; // Убедитесь, что api настроено для отправки запросов
import { useNavigate } from "react-router-dom";
import styles from "../styles/Post.module.css";
import { Heart, MessageCircle, User } from "lucide-react"; 

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user); 
  const token = useSelector((state) => state.auth.token);

  const [liked, setLiked] = useState(post.likes.includes(currentUser?.id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isSubscribed, setIsSubscribed] = useState(false); // Состояние подписки
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки для кнопки подписки

  // Проверка подписки при монтировании компонента
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (currentUser) {
          const response = await api.get(`/subscriptions/${currentUser.id}/following`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Проверяем, если среди подписок есть автор поста
          const isUserSubscribed = response.data.some(
            (subscription) => subscription._id === post.author._id
          );

          setIsSubscribed(isUserSubscribed);
        }
      } catch (error) {
        console.error("Ошибка при проверке подписки:", error);
      }
    };

    if (currentUser) {
      checkSubscription();
    }
  }, [currentUser, post.author._id, token]);

  const handleLike = () => {
    const newLiked = !liked;
    dispatch(likePost({ postId: post.id, userId: currentUser.id, liked: newLiked }));
    setLiked(newLiked);
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1)); 
  };

  const handleSubscription = async () => {
    if (isLoading) return; // Если запрос уже в процессе, не отправляем новый запрос
  
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Токен авторизации не найден");
        return;
      }
  
      if (isSubscribed) {
        // Отписка
        const response = await api.delete(
          `/subscriptions/${post.author._id}/unfollow`,
          {
            data: { targetUserId: post.author._id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setIsSubscribed(false); // Обновление состояния подписки
        }
      } else {
        // Подписка
        const response = await api.post(
          `/subscriptions/${post.author._id}/follow`,
          { targetUserId: post.author._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setIsSubscribed(true); // Обновление состояния подписки
        }
      }
    } catch (error) {
      console.error("Ошибка при подписке/отписке:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Проверка, является ли строка действительным base64 изображением
  const isValidBase64 = (str) => {
    return /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,/.test(str);
  };

  // Выбираем аватар из base64 или показываем иконку по умолчанию
  const avatarSrc = isValidBase64(post.author?.avatar) ? post.author?.avatar : null;

  return (
    <div className={styles.post}>
      <div className={styles.header}>
        {avatarSrc ? (
          <img src={avatarSrc} alt="Avatar" className={styles.avatar} />
        ) : (
          <User className={styles.avatarIcon} />
        )}
        <div className={styles.info}>
          <p className={styles.username}>
            {post.author?.username || "Неизвестный пользователь"}
          </p>
          <p className={styles.date}>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Показываем кнопку подписки, если текущий пользователь не является автором поста */}
        {currentUser && currentUser.id !== post.author._id && (
          <button
            className={styles.followBtn}
            onClick={handleSubscription}
            disabled={isLoading} // Отключаем кнопку, если запрос в процессе
          >
            {isLoading ? "Загрузка..." : isSubscribed ? "Отписаться" : "Подписаться"}
          </button>
        )}
      </div>

      {/* Изображение поста */}
      <img src={post.image} alt="Post" className={styles.postImage} />

      <div className={styles.actions}>
        {/* Лайк и комментарии */}
        <Heart
          className={liked ? styles.liked : styles.icon}
          onClick={handleLike}
        />
        <MessageCircle
          className={styles.icon}
          onClick={() => navigate(`/post/${post.id}/comments`)}
        />
      </div>

      {/* Количество лайков */}
      <p className={styles.likes}>{likeCount} лайков</p>

      {post.description && (
  <p className={styles.description}>{post.description}</p>
)}

      {/* Отображение первого комментария */}
      {post.comments.length > 0 && (
        <p className={styles.comment}>
          <strong>{post.comments[0].author?.username}:</strong>{" "}
          {post.comments[0].text}
        </p>
      )}

      {/* Если комментариев больше одного, показываем ссылку на все комментарии */}
      {post.comments.length > 1 && (
        <p
          className={styles.viewComments}
          onClick={() => navigate(`/post/${post.id}/comments`)}
        >
          Посмотреть все {post.comments.length} комментариев
        </p>
      )}
    </div>
  );
};

export default Post;
