import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние слайса
const initialState = {
  posts: [],
};

// Создание слайса
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Действие для загрузки постов
    setPosts(state, action) {
      state.posts = action.payload;
    },
    // Действие для лайка поста
    likePost(state, action) {
      const { postId, userId, liked } = action.payload;
      const post = state.posts.find((post) => post.id === postId);

      if (post) {
        // Если пользователь лайкнул пост
        if (liked) {
          post.likes.push(userId); // Добавляем лайк
        } else {
          post.likes = post.likes.filter((id) => id !== userId); // Удаляем лайк
        }
      }
    },
  },
});

// Экспортируем действия и редюсер
export const { setPosts, likePost } = postSlice.actions;
export default postSlice.reducer;
