import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const getTimeline = () => {
  return axios.get("/posts/timeline/all");
};

const getUserPosts = (userName) => {
  return axios.get(`/posts/userposts/${userName}`);
};

const newPost = (post) => {
  return axios.post(`/posts`, post, config);
};

const deletePost = (id) => {
  return axios.delete(`/posts/${id}`);
};

const likePost = (id) => {
  return axios.put(`/posts/${id}/like`);
};

export const PostService = {
  getTimeline,
  getUserPosts,
  newPost,
  deletePost,
  likePost,
};
