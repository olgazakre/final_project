import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";

const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);  // Получаем токен из состояния Redux

  const loadComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      setComments(response.data);
      setError(null);  // Очищаем ошибку при успешной загрузке
    } catch (error) {
      console.error("Ошибка при загрузке комментариев", error);
      setError("Не удалось загрузить комментарии");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = async () => {
    if (!token) {
      setError("Вы должны быть авторизованы");
      return;
    }
    if (newComment.trim() === "") return;

    try {
      const response = await api.post(
        `/posts/${postId}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }  // Передаем токен в заголовках
      );
      // Используем prevState для добавления нового комментария в начало списка
      setComments((prev) => [response.data, ...prev]);
      setNewComment("");  // Очищаем поле ввода комментария
    } catch (error) {
      console.error("Ошибка при добавлении комментария", error);
      if (error.response) {
        console.error("Ответ сервера:", error.response.data);
        if (error.response.status === 401) {
          setError("Не авторизованы или токен истек");
        }
      } else {
        setError("Не удалось добавить комментарий");
      }
    }
  };

  const deleteComment = async (commentId) => {
    if (!token) {
      setError("Вы должны быть авторизованы");
      return;
    }

    try {
      await api.delete(`/posts/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },  // Передаем токен для удаления комментария
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Ошибка при удалении комментария", error);
      setError("Не удалось удалить комментарий");
    }
  };

  useEffect(() => {
    loadComments();  // Загружаем комментарии при первом рендере
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
