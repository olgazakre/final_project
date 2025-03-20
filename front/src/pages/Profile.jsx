import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useSelector, useDispatch } from "react-redux";
import FollowButton from "../components/FollowButton";
import { Loader2, ImageOff } from "lucide-react";
import styles from "../styles/Profile.module.css";
import PostModal from "../components/PostModal";
import { logout } from "../redux/authSlice"; 

const POSTS_PER_PAGE = 6;

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const currentUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
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
    setPosts([]);
    setPage(1);
    setHasMorePosts(true);
  }, [userId]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${POSTS_PER_PAGE}`);
        const newPosts = response.data;

        if (newPosts.length < POSTS_PER_PAGE) {
          setHasMorePosts(false);
        }

        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((post) => post._id));
          const filteredNewPosts = newPosts.filter((post) => !existingIds.has(post._id));
          return [...prevPosts, ...filteredNewPosts];
        });
      } catch (error) {
        console.error("Ошибка загрузки постов:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (userId) {
      fetchPosts();
    }
  }, [userId, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleLogout = () => {
    dispatch(logout()); 
    navigate("/auth/login"); 
  };

  if (loadingUser || !user) {
    return (
      <div className={styles.loaderContainer}>
        <Loader2 className={styles.loaderIcon} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBlock}>
        <img
          src={user.avatar}
          alt="Avatar"
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <div className={styles.usernameBlock}>
            <h2 className={styles.username}>{user.username}</h2>
            {currentUser && currentUser.id === user._id ? (
              <>
                <button
                  onClick={() => navigate(`/edit-profile`)}
                  className={styles.editProfileButton}
                >
                  Редактировать профиль
                </button>
                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                {currentUser && currentUser.id !== user._id && (
                  <FollowButton targetUserId={user._id} />
                )}
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className={styles.messageButton}
                >
                  Сообщение
                </button>
              </>
            )}
          </div>
          <div className={styles.statsBlock}>
            <span><strong>постов - </strong>{user.posts.length}</span>
            <span><strong>подписчиков - </strong>{user.followers.length}</span>
            <span><strong>подписок - </strong>{user.following.length}</span>
          </div>
          <p className={styles.bio}>{user.bio}</p>
        </div>
      </div>

      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <img
            key={post._id}
            src={post.image}
            alt="Post"
            className={styles.postImage}
            onClick={() => setSelectedPostId(post._id)} 
          />
        ))}
      </div>

      <div className={styles.loadMoreBlock}>
        {loadingPosts && <Loader2 className={styles.loaderIcon} />}
        {!loadingPosts && hasMorePosts && (
          <button
            onClick={handleLoadMore}
            className={styles.loadMoreButton}
          >
            Показать ещё
          </button>
        )}
        {!hasMorePosts && posts.length > 0 && (
          <div className={styles.noMorePosts}>
            <ImageOff size={32} />
            <p>Это все посты</p>
          </div>
        )}
        {!loadingPosts && posts.length === 0 && (
          <div className={styles.noPostsText}>У пользователя пока нет постов</div>
        )}
      </div>

      {selectedPostId && (
        <PostModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} />
      )}
    </div>
  );
};

export default Profile;
