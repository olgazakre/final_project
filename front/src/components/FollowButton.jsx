import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useSelector } from "react-redux";
import styles from "../styles/FollowButton.module.css";

const FollowButton = ({ targetUserId, authorId }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!currentUser) return;

      try {
        const response = await api.get(`/subscriptions/${currentUser.id}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const isUserSubscribed = response.data.some(
          (subscription) => subscription._id === targetUserId
        );
        setIsSubscribed(isUserSubscribed);
      } catch (error) {
        console.error("Ошибка при проверке подписки:", error);
      }
    };

    checkSubscription();
  }, [currentUser, targetUserId, token]);

  const handleSubscription = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (!token) {
        console.error("Нет токена авторизации");
        return;
      }

      if (isSubscribed) {
        await api.delete(`/subscriptions/${targetUserId}/unfollow`, {
          data: { targetUserId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsSubscribed(false);
      } else {
        await api.post(
          `/subscriptions/${targetUserId}/follow`,
          { targetUserId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error("Ошибка при подписке/отписке:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser || currentUser.id === authorId) return null;

  return (
    <button
      className={styles.followBtn}
      onClick={handleSubscription}
      disabled={isLoading}
    >
      {isLoading ? "Загрузка..." : isSubscribed ? "Отписаться" : "Подписаться"}
    </button>
  );
};

export default FollowButton;
