import { useState, useEffect } from "react";
import api from "../utils/api";

const useLike = (post, fullUser, postId, currentUser, token) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);



  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${postId}`);
        setLikeCount(response.data.likes.length);
      } catch (error) {
        console.error("Ошибка загрузки поста:", error);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  // Синхронизируем лайк после загрузки поста и полного юзера
  useEffect(() => {
    if (!post || !fullUser) return;
    const isLiked = fullUser.likes.some((likePostId) =>
      post.likes.includes(likePostId)
    );
    setLiked(isLiked);
    setLikeCount(post.likes.length);
  }, [post, fullUser]);

  const handleLike = async () => {
    try {
      await api.post(
        `/liked/posts/${postId}/like`,
        { userId: currentUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Ошибка при лайке:", error);
    }
  };

  return { liked, likeCount, handleLike };
};

export default useLike;
