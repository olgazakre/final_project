import React, { useState } from "react";
import styles from "../styles/CreatePostModal.module.css";
import { X, Image as ImageIcon } from "lucide-react";
import api from "../utils/api"; 
import { useSelector } from "react-redux"; 

const CreatePostModal = ({ isOpen, onClose, onPostSubmit }) => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const token = useSelector((state) => state.auth.token); 

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);  
    }
  };

  const handleSubmit = async () => {
    if (image) { 
      const formData = new FormData(); 
      formData.append("description", description);
      formData.append("image", image); 

      try {
        const response = await api.post(
          "/posts", 
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
              "Content-Type": "multipart/form-data", 
            },
          }
        );

        onPostSubmit(response.data);
        setImage(null);
        setDescription(""); 
        onClose(); 
      } catch (error) {
        console.error("Ошибка при создании поста:", error);
        alert("Произошла ошибка при создании поста. Пожалуйста, попробуйте позже.");
      }
    } else {
      alert("Пожалуйста, загрузите изображение.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Создать новый пост</h2>
          <button className={styles.shareBtn} onClick={handleSubmit}>
            Поделиться
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.left}>
            {image ? (
              <img
                src={URL.createObjectURL(image)} 
                alt="Preview"
                className={styles.previewImage}
              />
            ) : (
              <label className={styles.uploadLabel}>
                <ImageIcon className={styles.uploadIcon} />
                <span>Загрузить фото</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.hiddenInput}
                />
              </label>
            )}
          </div>

          <div className={styles.right}>
            <textarea
              placeholder="Описание..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            />
          </div>
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default CreatePostModal;
