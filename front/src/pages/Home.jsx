import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle } from 'lucide-react'; 
import api from '../utils/api'; 
import Post from '../components/Post'; 
import styles from '../styles/Home.module.css'; 

const Home = () => {
  const [posts, setPosts] = useState([]); 
  const [allPosts, setAllPosts] = useState([]); 
  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true); 
  const [loading, setLoading] = useState(false); 
  const isFetching = useRef(false); 

  const loadPosts = useCallback(async () => {
    if (isFetching.current || !hasMore) return; 

    isFetching.current = true;
    setLoading(true);

    try {
      const postsResponse = await api.get('/posts');
      const newPosts = postsResponse.data || [];

      setAllPosts(newPosts);

      const displayedPosts = newPosts.slice(0, page * 4);
      setPosts(displayedPosts);

      if (newPosts.length <= page * 4) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Ошибка загрузки постов:', error);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, [page, hasMore]);

  useEffect(() => {
    loadPosts();
  }, [page, loadPosts]);

  return (
    <div className={styles.container}>
      {loading && <p className={styles.loading}>Загрузка...</p>}
      <div className={styles.postsContainer}>
        {posts.map((post) => (
          <div key={post._id} className={styles.postItem}>
            <Post post={post} /> 
          </div>
        ))}
      </div>

      {hasMore && !loading && (
        <div className={styles.loadMoreContainer}>
          <button
            className={styles.loadMore}
            onClick={() => setPage((prevPage) => prevPage + 1)}
          >
            Показать еще
          </button>
        </div>
      )}

      {!loading && !hasMore && allPosts.length > 0 && (
        <div className={styles.noMorePosts}>
          <CheckCircle className={styles.checkIcon} />
          <span>Это все посты</span>
        </div>
      )}
    </div>
  );
};

export default Home;
