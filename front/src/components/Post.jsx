import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import useLike from "../hooks/useLike";
import useComments from "../hooks/useComments";
import CommentModal from "./CommentModal";
import styles from "../styles/Post.module.css";
import PostModal from "./PostModal";
import { useSelector } from "react-redux";
import api from "../utils/api";

const Post = ({ post }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [showModal, setShowModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postData, setPostData] = useState(post);
  const [fullUser, setFullUser] = useState(null);
const postId = post._id

  const openPostModal = () => setShowPostModal(true);
  const closePostModal = () => setShowPostModal(false);

  const { comments, setNewComment, newComment, addComment, deleteComment, loading, error } = useComments(postData._id);

  const { liked, likeCount, handleLike } = useLike(post, fullUser, postId, currentUser, token);

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

  

  const isValidBase64 = (str) =>
    /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,/.test(str);

  const avatarSrc = isValidBase64(postData.author?.avatar)
    ? postData.author.avatar
    : null;

  const lastComment = comments.length > 0 ? comments[0] : null;

  const truncatedComment =
    lastComment?.text && lastComment.text.length > 30
      ? `${lastComment.text.substring(0, 30)}...`
      : lastComment?.text || "";

  useEffect(() => {
    setPostData((prevPost) => ({
      ...prevPost,
      comments: comments,
    }));
  }, [comments]);

  useEffect(() => {
    setPostData(post); 
  }, [post]);

  const updateCommentsInParent = (newComment) => {
    setPostData((prevPost) => ({
      ...prevPost,
      comments: [...prevPost.comments, newComment], 
    }));
  };

  const handleCommentUpdate = async () => {
    try {
      await addComment();
      updateCommentsInParent(newComment);
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
    }
  };

  return (
    <div className={styles.post}>
      <div className={styles.header}>
        {avatarSrc ? (
          <Link to={`/profile/${postData.author._id}`}>
            <img src={avatarSrc} alt="Avatar" className={styles.avatar} />
          </Link>
        ) : (
          <Link to={`/profile/${postData.author._id}`}>
            <User className={styles.avatarIcon} />
          </Link>
        )}

        <div className={styles.info}>
          <Link to={`/profile/${postData.author._id}`}>
            <p className={styles.username}>
              {postData.author?.username || "Неизвестный пользователь"}
            </p>
          </Link>
          <p className={styles.date}>
            {new Date(postData.createdAt).toLocaleDateString()}
          </p>
        </div>
        <FollowButton targetUserId={postData.author._id} />
      </div>

      <img
        src={postData.image}
        alt="Post"
        className={styles.postImage}
        onClick={openPostModal}
      />

      <div className={styles.actions}>
        <Heart
          className={liked ? styles.liked : styles.icon}
          onClick={handleLike}
        />
        <MessageCircle
          className={styles.icon}
          onClick={() => setShowModal(true)}
        />
      </div>

      <p className={styles.likes}>{likeCount} лайков</p>

      {postData.description && (
        <p className={styles.description}>{postData.description}</p>
      )}

      {lastComment && lastComment.text && (
        <p className={styles.comment}>
          {lastComment.user.username}: {truncatedComment}
        </p>
      )}

      {comments.length > 1 && (
        <p
          className={styles.viewComments}
          onClick={() => setShowModal(true)}
        >
          Посмотреть все комментарии ({comments.length})
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <CommentModal
        showModal={showModal}
        setShowModal={setShowModal}
        comments={comments}
        setNewComment={setNewComment}
        newComment={newComment}
        addComment={handleCommentUpdate} 
        deleteComment={deleteComment}
        loading={loading}
        currentUser={currentUser}
        onCommentAdded={updateCommentsInParent} 
      />

      {showPostModal && (
        <PostModal
        postId={postData._id}
        onClose={closePostModal}
        setPostData={setPostData}
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
        deleteComment={deleteComment}
        loading={loading}
        error={error}
      />
      
      )}
    </div>
  );
};

export default Post;
