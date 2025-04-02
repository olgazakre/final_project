import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useSelector, useDispatch } from "react-redux";
import FollowButton from "../components/FollowButton";
import { Loader2, ImageOff } from "lucide-react";
import styles from "../styles/Profile.module.css";
import PostModal from "../components/PostModal";
import { logout } from "../redux/authSlice";
import useComments from "../hooks/useComments";

const POSTS_PER_PAGE = 6;

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);  // Все посты пользователя
  const [displayedPosts, setDisplayedPosts] = useState([]); // Посты для отображения
  const [page, setPage] = useState(1);  // Для пагинации
  const [hasMorePosts, setHasMorePosts] = useState(false); // Проверка наличия дополнительных постов
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postData, setPostData] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    setPosts([]);  // Сбрасываем все посты при изменении userId
    setDisplayedPosts([]); // Сбрасываем отображаемые посты
    setPage(1);    // Начинаем с первой страницы
    setHasMorePosts(false);  // Нет дополнительных постов по умолчанию
  }, [userId]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await api.get(`/posts/user/${userId}`);
        const fetchedPosts = response.data;
        setPosts(fetchedPosts);  // Сохраняем все посты

        // Определяем, есть ли дополнительные посты
        setHasMorePosts(fetchedPosts.length > POSTS_PER_PAGE);

        // Отображаем только первые 6 постов
        setDisplayedPosts(fetchedPosts.slice(0, POSTS_PER_PAGE));
      } catch (error) {
        console.error("Ошибка загрузки постов:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  const openPostModal = async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      setPostData(response.data);
      setSelectedPostId(postId);
    } catch (error) {
      console.error("Ошибка загрузки поста:", error);
    }
  };

  const closePostModal = () => {
    setPostData(null);
    setSelectedPostId(null);
  };

  const { comments, newComment, setNewComment, addComment, deleteComment } = useComments(selectedPostId);

  if (loadingUser || !user) {
    return (
      <div className={styles.loaderContainer}>
        <Loader2 className={styles.loaderIcon} />
      </div>
    );
  }

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);

    // Добавляем следующие 6 постов
    const nextPosts = posts.slice(nextPage * POSTS_PER_PAGE - POSTS_PER_PAGE, nextPage * POSTS_PER_PAGE);
    setDisplayedPosts((prevPosts) => [...prevPosts, ...nextPosts]);

    // Если постов больше нет, скрываем кнопку
    if (nextPage * POSTS_PER_PAGE >= posts.length) {
      setHasMorePosts(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBlock}>
        <img src={user.avatar} alt="Avatar" className={styles.avatar} />
        <div className={styles.userInfo}>
          <div className={styles.usernameBlock}>
            <h2 className={styles.username}>{user.username}</h2>
            {currentUser && currentUser.id === user._id ? (
              <>
                <button onClick={() => navigate(`/edit-profile`)} className={styles.editProfileButton}>
                  Редактировать профиль
                </button>
                <button onClick={() => dispatch(logout()) && navigate("/auth/login")} className={styles.logoutButton}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                {currentUser && currentUser.id !== user._id && <FollowButton targetUserId={user._id} />}
                <button onClick={() => navigate(`/messages/${user._id}`)} className={styles.messageButton}>
                  Сообщение
                </button>
              </>
            )}
          </div>
          <div className={styles.statsBlock}>
            <span>
              <strong>постов - </strong>
              {user.posts.length}
            </span>
            <span>
              <strong>подписчиков - </strong>
              {user.followers.length}
            </span>
            <span>
              <strong>подписок - </strong>
              {user.following.length}
            </span>
          </div>
          <p className={styles.bio}>{user.bio}</p>
        </div>
      </div>

      <div className={styles.postsGrid}>
        {displayedPosts.map((post) => (
          <img key={post._id} src={post.image} alt="Post" className={styles.postImage} onClick={() => openPostModal(post._id)} />
        ))}
      </div>

      <div className={styles.loadMoreBlock}>
        {loadingPosts && <Loader2 className={styles.loaderIcon} />}
        {!loadingPosts && hasMorePosts && (
          <button onClick={handleLoadMore} className={styles.loadMoreButton}>
            Показать ещё
          </button>
        )}
        {!hasMorePosts && displayedPosts.length > 0 && (
          <div className={styles.noMorePosts}>
            <ImageOff size={32} />
            <p>Это все посты</p>
          </div>
        )}
        {!loadingPosts && displayedPosts.length === 0 && <div className={styles.noPostsText}>У пользователя пока нет постов</div>}
      </div>

      {selectedPostId && postData && (
        <PostModal
          postId={postData._id}
          onClose={closePostModal}
          postData={postData}
          setPostData={setPostData}
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          addComment={addComment}
          deleteComment={deleteComment}
        />
      )}
    </div>
  );
};

export default Profile;
