import React, { useState, useEffect } from 'react';
import api from '../utils/api'; 
import styles from '../styles/Explore.module.css'; 
import PostModal from '../components/PostModal';
import useComments from '../hooks/useComments';

const Explore = () => {
  const [randomPosts, setRandomPosts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postData, setPostData] = useState(null);

  const loadPosts = async () => {
    setLoading(true); 
    try {
      const response = await api.get('/posts');
      const allPosts = response.data; 

      const shuffledPosts = [...allPosts].sort(() => Math.random() - 0.5);
      setRandomPosts(shuffledPosts.slice(0, 9));
    } catch (err) {
      console.error(err);
      setError('Ошибка загрузки постов'); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadPosts(); 
  }, []);

  const openPostModal = async (postId) => {
    setSelectedPostId(postId);
    try {
      const response = await api.get(`/posts/${postId}`);
      setPostData(response.data);
    } catch (err) {
      console.error('Ошибка загрузки поста', err);
    }
  };

  const closePostModal = () => {
    setSelectedPostId(null);
    setPostData(null);
  };

  const { comments, newComment, setNewComment, addComment, deleteComment } = useComments(selectedPostId);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {randomPosts.map((post) => (
          <div key={post._id} className={styles.card}>
            <img
              src={post.image}
              alt={post.title}
              className={styles.image}
              onClick={() => openPostModal(post._id)}
            />
            <div className={styles.cardContent}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedPostId && postData && (
        <PostModal
          postId={postData._id}
          onClose={closePostModal}
          setPostData={setPostData}
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          addComment={addComment}
          deleteComment={deleteComment}

        />
      )}
    </div>
  );
};

export default Explore;

