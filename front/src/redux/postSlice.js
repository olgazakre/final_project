import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    },
    likePost(state, action) {
      const { postId, userId, liked } = action.payload;
      const post = state.posts.find((post) => post.id === postId);

      if (post) {
        if (liked) {
          post.likes.push(userId); 
        } else {
          post.likes = post.likes.filter((id) => id !== userId); 
        }
      }
    },
  },
});

export const { setPosts, likePost } = postSlice.actions;
export default postSlice.reducer;
