import React, { useState, useEffect } from 'react';
import api from '../utils/api'; 
import styles from '../styles/Explore.module.css'; 

const Explore = () => {
  const [randomPosts, setRandomPosts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const loadPosts = async () => {
    setLoading(true); 
    try {
      const response = await api.get('/posts');
      const allPosts = response.data; 

      const shuffledPosts = [...allPosts];
      for (let i = shuffledPosts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPosts[i], shuffledPosts[j]] = [shuffledPosts[j], shuffledPosts[i]]; 
      }

      setRandomPosts(shuffledPosts.slice(0, 10));
    } catch (err) {
        console.error(err)
      setError('Ошибка загрузки постов'); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadPosts(); 
  }, []);

  if (loading) {
    return <div>Загрузка...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {randomPosts.map((post) => (
          <div key={post._id} className={styles.card}>
            <img src={post.image} alt={post.title} className={styles.image} />
            <div className={styles.cardContent}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
