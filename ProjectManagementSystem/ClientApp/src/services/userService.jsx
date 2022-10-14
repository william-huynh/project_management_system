import axios from "axios";

const API_URL = "/api";

const detail = (id) => {
  return axios.get(API_URL + `/users/detail/${id}`);
};

const create = (data) => {
  return axios.post(API_URL + "/users/create-user", data);
};

const update = (id, data) => {
  return axios.put(API_URL + `/users/update/${id}`, data);
};

const getUpdateDetail = (id) => {
  return axios.get(API_URL + `/users/update-detail/${id}`);
};

const updateProfile = (id, data) => {
  return axios.put(API_URL + `/users/profile/update/${id}`, data);
};

const getProfileDetail = (id) => {
  return axios.get(API_URL + `/users/profile/${id}`);
};

const disable = (id) => {
  return axios.put(API_URL + `/users/disable-user/${id}`);
};

export default {
  detail,
  create,
  update,
  getUpdateDetail,
  updateProfile,
  getProfileDetail,
  disable,
};
