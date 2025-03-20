import React from "react";
import Modal from "react-modal";
import styles from "../styles/CommentModal.module.css";

Modal.setAppElement("#root");

const CommentModal = ({
  comments = [],
  showModal,
  setShowModal,
  setNewComment,
  newComment,
  addComment,
  deleteComment,
  loading,
}) => {
  const handleAddComment = async () => {
    // Добавление комментария
    await addComment(); // Подождем, пока комментарий добавится
    // Закрываем модальное окно после успешного добавления
    setShowModal(false);
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.modalContent}>
        <h2>Комментарии</h2>

        <div className={styles.commentsContainer}>
          {Array.isArray(comments) && comments.length > 0 ? (
            comments
              .slice()
              .reverse()
              .map((comment) => (
                <div key={comment._id} className={styles.comment}>
                  <strong>{comment.author?.username}:</strong> {comment.text}
                  <button
                    onClick={() => deleteComment(comment._id)}
                    className={styles.deleteButton}
                  >
                    Удалить
                  </button>
                </div>
              ))
          ) : (
            <p>Комментариев пока нет.</p>
          )}
        </div>

        <div className={styles.addComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите комментарий..."
            rows={3}
          />
          <button onClick={handleAddComment} disabled={loading}>
            {loading ? "Загрузка..." : "Отправить"}
          </button>
        </div>

        <button onClick={() => setShowModal(false)} className={styles.closeButton}>
          X
        </button>
      </div>
    </Modal>
  );
};

export default CommentModal;
