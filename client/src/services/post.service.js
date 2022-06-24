import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const getTimeline = () => {
  return axios.get("/api/posts/timeline/all");
};

const getUserPosts = (userName) => {
  return axios.get(`/api/posts/userposts/${userName}`);
};

const newPost = (post) => {
  return axios.post(`/api/posts`, post, config);
};

const deletePost = (id) => {
  return axios.delete(`/api/posts/${id}`);
};

const likePost = (id) => {
  return axios.put(`/api/posts/${id}/like`);
};

export const PostService = {
  getTimeline,
  getUserPosts,
  newPost,
  deletePost,
  likePost,
};
