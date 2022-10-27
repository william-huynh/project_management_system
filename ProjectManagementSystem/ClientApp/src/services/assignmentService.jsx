import axios from "axios";

const API_URL = "/api";

const detail = (id) => {
  return axios.get(API_URL + `/assignments/detail/${id}`);
};

const create = (data) => {
  return axios.post(API_URL + "/assignments/create", data);
};

const update = (id, data) => {
  return axios.put(API_URL + `/assignments/update/${id}`, data);
};

const disable = (id) => {
  return axios.put(API_URL + `/assignments/disable/${id}`);
};

const updateDetail = (id) => {
  return axios.get(API_URL + `/assignments/update-detail/${id}`);
};

const getCategories = () => {
  return axios.get(API_URL + "/assignments/get-categories");
};

const createCategory = (data) => {
  return axios.post(API_URL + "/assignments/create-category", data);
};

const getSprints = () => {
  return axios.get(API_URL + "/assignments/get-sprints");
};

export default {
  detail,
  create,
  update,
  disable,
  updateDetail,
  getCategories,
  createCategory,
  getSprints,
};
