import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import api from "../utils/api";
import styles from "../styles/EditProfile.module.css";
import Cookies from "js-cookie";
import { setUser } from "../redux/authSlice"; 

const EditProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar || "/default-avatar.png");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setBio(currentUser.bio || "");
      setAvatarPreview(currentUser.avatar || "/default-avatar.png");
    }
  }, [currentUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
  
    try {
      setLoading(true);
      const response = await api.put("/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const updatedUser = response.data;
  
      localStorage.setItem("user", JSON.stringify(updatedUser));
  
      dispatch(setUser({ user: updatedUser }));
  
      alert("Профиль успешно обновлён!");
      navigate(-1); 
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      alert("Ошибка обновления профиля");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate(-1); 
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={() => navigate(-1)}>
        X
      </button>

      <h2>Редактировать профиль</h2>

      <div className={styles.avatarSection}>
        <img src={avatarPreview} alt="Avatar" className={styles.avatar} />
        <p className={styles.username}>{username}</p>
        <p className={styles.bio}>{bio}</p>
        <label className={styles.uploadButton}>
          Изменить фото профиля
          <input type="file" onChange={handleAvatarChange} className={styles.fileInput} />
        </label>
      </div>

      <div className={styles.formSection}>
        <label>Имя пользователя</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />

        <label>Биография</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={styles.textarea}
        />

        <div className={styles.buttonGroup}>
          <button onClick={handleCancel} className={styles.cancelButton}>
            Отменить
          </button>
          <button onClick={handleSave} className={styles.saveButton} disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
