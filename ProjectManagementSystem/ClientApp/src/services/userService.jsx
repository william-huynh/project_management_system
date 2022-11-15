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

const disable = (id) => {
  return axios.put(API_URL + `/users/disable-user/${id}`);
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

const checkUserAssigned = (id) => {
  return axios.get(API_URL + `/users/check-developer-assign-project/${id}`);
};

const checkAdvisorDisable = (id) => {
  return axios.get(API_URL + `/users/check-advisor/${id}`);
};

const checkDeveloperDisable = (id) => {
  return axios.get(API_URL + `/users/check-developer/${id}`);
};

const getProjectId = (id) => {
  return axios.get(API_URL + `/users/get-project-id/${id}`);
};

export default {
  detail,
  create,
  update,
  disable,
  getUpdateDetail,
  updateProfile,
  getProfileDetail,
  checkUserAssigned,
  checkAdvisorDisable,
  checkDeveloperDisable,
  getProjectId,
};
