import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { X, Heart, MessageCircle, MoreHorizontal, Clipboard, Edit2, Trash2 } from "lucide-react";
import FollowButton from "./FollowButton";
import styles from "../styles/PostModal.module.css";
import api from "../utils/api";

const PostModal = ({   
  postId, 
  onClose, 
  setPostData, 
  comments, 
  newComment, 
  setNewComment, 
  addComment, 
  deleteComment, 
  loading, 
  error  }) => {
    const currentUser = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
  
    const [post, setPost] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const menuRef = useRef();
  
    const [fullUser, setFullUser] = useState(null); 
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [newDescription, setNewDescription] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [commentSubmitting, setCommentSubmitting] = useState(false);
  
    useEffect(() => {
      const fetchFullUser = async () => {
        try {
          const response = await api.get(`/users/${currentUser.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFullUser(response.data);
        } catch (error) {
          console.error("Ошибка загрузки пользователя:", error);
        }
      };
      if (currentUser.id && token) fetchFullUser();
    }, [currentUser.id, token]);
  
    useEffect(() => {
      const fetchPost = async () => {
        try {
          const response = await api.get(`/posts/${postId}`);
          setPost(response.data);
          setLikeCount(response.data.likes.length);
          setNewDescription(response.data.description);
        } catch (error) {
          console.error("Ошибка загрузки поста:", error);
        }
      };
      if (postId) fetchPost();
    }, [postId]);
  
    useEffect(() => {
      if (!post || !fullUser) return;
      const isLiked = fullUser.likes.some((likePostId) =>
        post.likes.includes(likePostId)
      );
      setLiked(isLiked);
    }, [post, fullUser]);  

  const handleLike = async () => {
    try {
      await api.post(`/liked/posts/${postId}/like`, { userId: currentUser._id }, { headers: { Authorization: `Bearer ${token}` } });
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

      setPost((prevPost) => {
        const updatedPost = {
          ...prevPost,
          description: newDescription,
          image: newImage ? URL.createObjectURL(newImage) : prevPost.image,
        };

        setPostData(updatedPost);

        return updatedPost;
      });
    } catch (error) {
      console.error("Ошибка при редактировании поста:", error);
      alert("Ошибка при редактировании поста");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentSubmitting(true);
    await addComment(); 
    setCommentSubmitting(false);

    setPostData((prevPost) => ({
      ...prevPost,
      comments: [...prevPost.comments, newComment], 
    }));

    onClose(); 
  };

  if (!post) return null; 

  const author = post.author || {};

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}><X /></button>
        <div className={styles.leftSection}>
          <img src={post.image} alt="Post" className={styles.postImage} />
        </div>
        <div className={styles.rightSection}>
          <div className={styles.authorBlock}>
            {author && author.avatar ? (
              <img src={author.avatar} alt="Avatar" className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>Нет изображения</div>
            )}
            <span className={styles.username}>{author.username || "Неизвестный пользователь"}</span>

            {currentUser.id === author._id ? (
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
              <FollowButton targetUserId={author._id} />
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

              <div className={styles.commentsSection}>
                {loading ? (
                  <div>Загрузка комментариев...</div>
                ) : error ? (
                  <div>{error}</div>
                ) : (
                  comments.map((comment) => {
                    const commentAuthor = comment.user || {};
                    return (
                      <div key={comment._id} className={styles.comment}>
                        {commentAuthor.avatar ? (
                          <img src={commentAuthor.avatar} alt="Avatar" className={styles.commentAvatar} />
                        ) : (
                          <div className={styles.commentAvatarPlaceholder}>Нет изображения</div>
                        )}
                        <div className={styles.commentContent}>
                          <span className={styles.commentUsername}>{commentAuthor.username || "Неизвестный пользователь"}</span>
                          <p>{comment.text}</p>
                        </div>
                        {comment.user && currentUser._id === comment.user._id && (
                          <button onClick={() => deleteComment(comment._id)} className={styles.deleteCommentButton}>Удалить</button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Добавьте комментарий..."
                  className={styles.commentInput}
                  disabled={commentSubmitting}
                />
                <button type="submit" className={styles.submitButton} disabled={commentSubmitting}>
                  {commentSubmitting ? "Отправка..." : "Поделиться"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostModal;
