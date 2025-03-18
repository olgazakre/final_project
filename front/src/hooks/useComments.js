import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      console.log("Ответ от сервера:", response); 
      setComments(response.data); 
      setError(null);
    } catch (error) {
      console.error("Ошибка при загрузке комментариев", error);
      setError("Не удалось загрузить комментарии");
    } finally {
      setLoading(false); 
    }
  }, [postId]);

  const addComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const response = await api.post(`/posts/${postId}/comment`, {
        text: newComment,
      });
      setComments((prev) => [response.data, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Ошибка при добавлении комментария", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/posts/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Ошибка при удалении комментария", error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    setNewComment,
    newComment,
    addComment,
    deleteComment,
    loading,
    error,
  };
};

export default useComments;
