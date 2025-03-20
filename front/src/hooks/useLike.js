import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";

const useLike = (post) => {
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post ? post.likes.length : 0);

  useEffect(() => {
    if (!post || !post.likes || !currentUser || !currentUser.likes) return;

    const isLiked = currentUser.likes.some(userLikeId =>
      post.likes.includes(userLikeId)
    );
    setLiked(isLiked);
  }, [post, currentUser]);

  const handleLike = async () => {
    if (!currentUser || !token || !post || !post._id) {
      console.error("Пост или пользователь не существует.");
      return;
    }

    try {
      await api.post(`/liked/posts/${post._id}/like`, 
        { userId: currentUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLiked(!liked); 
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      
    } catch (error) {
      console.error("Ошибка при лайке/дизлайке поста:", error);
    }
  };

  return { liked, likeCount, handleLike };
};

export default useLike;
