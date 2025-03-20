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

const Post = ({ post }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const { liked, likeCount, handleLike } = useLike(post);
  const openPostModal = () => setShowPostModal(true);
const closePostModal = () => setShowPostModal(false);
  const {
    comments,
    setNewComment,
    newComment,
    addComment,
    deleteComment,
    loading,
    error,
  } = useComments(post._id);

  const isValidBase64 = (str) =>
    /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,/.test(str);

  const avatarSrc = isValidBase64(post.author?.avatar)
    ? post.author.avatar
    : null;

  const lastComment = comments.length > 0 ? comments[0] : null;

  const truncatedComment =
    lastComment?.text && lastComment.text.length > 30
      ? `${lastComment.text.substring(0, 30)}...`
      : lastComment?.text || "";

  useEffect(() => {
    console.log("Комментарии в компоненте Post:", comments);
  }, [comments]);

  return (
    <div className={styles.post}>
      <div className={styles.header}>
        {avatarSrc ? (
          <Link to={`/profile/${post.author._id}`}> 
            <img src={avatarSrc} alt="Avatar" className={styles.avatar} />
          </Link>
        ) : (
          <Link to={`/profile/${post.author._id}`}> 
            <User className={styles.avatarIcon} />
          </Link>
        )}
        
        <div className={styles.info}>
          <Link to={`/profile/${post.author._id}`}>
            <p className={styles.username}>
              {post.author?.username || "Неизвестный пользователь"}
            </p>
          </Link>
          <p className={styles.date}>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <FollowButton
          targetUserId={post.author._id}
        />
      </div>

      <img
  src={post.image}
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

      {post.description && (
        <p className={styles.description}>{post.description}</p>
      )}

      {lastComment && lastComment.text && (
        <p className={styles.comment}>{lastComment.author.username}: {truncatedComment}</p>
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
  addComment={addComment}
  deleteComment={deleteComment}
  loading={loading}
  currentUser={currentUser}     
  postAuthorId={post.author._id} 
/>


{showPostModal && (
  <PostModal postId={post._id} onClose={closePostModal}/>
)}
    </div>
  );
};

export default Post;

