import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const loadLoggedInUser = () => {
  return axios.get("/api/users");
};

const getUser = (userName) => {
  return axios.get(`/api/users/${userName}`);
};

const followUser = (userId) => {
  return axios.put(`/api/users/${userId}/follow`);
};

const unfollowUser = (userId) => {
  return axios.put(`/api/users/${userId}/unfollow`);
};

const uploadProfilePicture = (data) => {
  return axios.put(`/api/users/upload/profilephoto`, data, config);
};
const uploadCoverPicture = (data) => {
  return axios.put(`/api/users/upload/coverphoto`, data, config);
};
const deleteProfilePicture = (id) => {
  return axios.delete(`/api/users/delete/profilephoto/${id}`);
};
const deleteCoverPicture = (id) => {
  return axios.delete(`/api/users/delete/coverphoto/${id}`);
};

export const UserService = {
  loadLoggedInUser,
  getUser,
  followUser,
  unfollowUser,
  uploadProfilePicture,
  uploadCoverPicture,
  deleteCoverPicture,
  deleteProfilePicture,
};
