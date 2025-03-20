import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { X, Heart, MessageCircle, MoreHorizontal, Clipboard, Edit2, Trash2 } from "lucide-react";
import FollowButton from "./FollowButton";
import styles from "../styles/PostModal.module.css";
import useComments from "../hooks/useComments";
import api from "../utils/api";

const PostModal = ({ postId, onClose }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [post, setPost] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const menuRef = useRef();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [newDescription, setNewDescription] = useState(""); 
  const [newImage, setNewImage] = useState(null); 

  const { comments, setNewComment, newComment, addComment, deleteComment, loading, error } = useComments(postId);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${postId}`);
        setPost(response.data);
        setLikeCount(response.data.likes.length);
        const isLiked = response.data.likes.includes(currentUser._id);
        setLiked(isLiked);
        setNewDescription(response.data.description); 
      } catch (error) {
        console.error("Ошибка загрузки поста:", error);
      }
    };
    fetchPost();
  }, [postId, currentUser._id]);

  const handleLike = async () => {
    try {
      await api.post(`/liked/posts/${postId}/like`,
        { userId: currentUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Ошибка при лайке:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } });
      alert("Пост удалён");
      onClose();
    } catch (error) {
      console.error("Ошибка удаления поста:", error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
    alert("Ссылка скопирована");
    setMenuOpen(false);
  };

  const handleEditPost = () => {
    setIsEditing(true); 
    setMenuOpen(false); 
  };

  const handleCancelEdit = () => {
    setIsEditing(false); 
    setNewDescription(post.description); 
    setNewImage(null);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    if (newImage) {
      formData.append("image", newImage);
    }
    formData.append("description", newDescription);

    try {
      await api.put(`/posts/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setIsEditing(false); 
      alert("Пост успешно отредактирован");
      setPost((prevPost) => ({
        ...prevPost,
        description: newDescription,
        image: newImage ? URL.createObjectURL(newImage) : prevPost.image,
      }));
    } catch (error) {
      console.error("Ошибка при редактировании поста:", error);
      alert("Ошибка при редактировании поста");
    }
  };

  if (!post) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}><X /></button>
        <div className={styles.leftSection}>
          <img src={post.image} alt="Post" className={styles.postImage} />
        </div>
        <div className={styles.rightSection}>
          <div className={styles.authorBlock}>
            <img src={post.author.avatar} alt="Avatar" className={styles.avatar} />
            <span className={styles.username}>{post.author.username}</span>

            {currentUser.id === post.author._id ? (
              <div className={styles.menuWrapper} ref={menuRef}>
                <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
                  <MoreHorizontal />
                </button>
                {menuOpen && (
                  <div className={styles.dropdownMenu}>
                    <button onClick={handleEditPost}><Edit2 size={16} /> Редактировать</button>
                    <button onClick={handleDeletePost}><Trash2 size={16} /> Удалить</button>
                    <button onClick={handleCopyLink}><Clipboard size={16} /> Скопировать ссылку</button>
                    <button onClick={() => setMenuOpen(false)}>Отмена</button>
                  </div>
                )}
              </div>
            ) : (
              <FollowButton targetUserId={post.author._id} />
            )}
          </div>

          {isEditing ? (
            <div className={styles.editSection}>
              <label className={styles.imageUploadLabel}>
                <span>Загрузите новое фото</span>
                <input
                  type="file"
                  className={styles.imageUploadInput}
                  onChange={(e) => setNewImage(e.target.files[0])}
                />
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className={styles.descriptionInput}
              />
              <div className={styles.buttons}>
                <button onClick={handleCancelEdit} className={styles.cancelButton}>Отменить</button>
                <button onClick={handleSaveEdit} className={styles.saveButton}>Сохранить</button>
              </div>
            </div>
          ) : (
            <>
              <p className={styles.description}>{post.description}</p>
              <span className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</span>

              {!isEditing && (
                <div className={styles.statsBlock}>
                  <span onClick={handleLike} className={styles.iconWrapper}>
                    <Heart
                      fill={liked ? "red" : "none"}
                      color={liked ? "red" : "black"}
                    /> {likeCount}
                  </span>

                  <span className={styles.iconWrapper}>
                    <MessageCircle color="black" /> {comments.length}
                  </span>
                </div>
              )}

              {!isEditing && (
                <div className={styles.commentsSection}>
                  {loading ? (
                    <div>Загрузка комментариев...</div>
                  ) : error ? (
                    <div>{error}</div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment._id} className={styles.comment}>
                        <img src={comment.author.avatar} alt="Avatar" className={styles.commentAvatar} />
                        <div className={styles.commentContent}>
                          <span className={styles.commentUsername}>{comment.author.username}</span>
                          <p>{comment.text}</p>
                        </div>
                        {currentUser._id === comment.author._id && (
                          <button onClick={() => deleteComment(comment._id)} className={styles.deleteCommentButton}>Удалить</button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); addComment(); }} className={styles.commentForm}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Добавьте комментарий..."
                  className={styles.commentInput}
                />
                <button type="submit" className={styles.submitButton}>Поделиться</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostModal;
