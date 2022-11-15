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

const accept = (id) => {
  return axios.put(API_URL + `/assignments/accept-assignment/${id}`);
};

const disable = (id) => {
  return axios.put(API_URL + `/assignments/disable/${id}`);
};

const updateDetail = (id) => {
  return axios.get(API_URL + `/assignments/update-detail/${id}`);
};

const getCategories = (id) => {
  return axios.get(API_URL + `/assignments/get-categories/${id}`);
};

const createCategory = (data) => {
  return axios.post(API_URL + "/assignments/create-category", data);
};

const getSprints = (id) => {
  return axios.get(API_URL + `/assignments/get-sprints/${id}`);
};

const getFilters = (id) => {
  return axios.get(API_URL + `/assignments/get-filters/${id}`);
};

const getBoard = (id) => {
  return axios.get(API_URL + `/assignments/get-assigned-board/${id}`);
};

const updateStatus = (id, status) => {
  return axios.put(API_URL + `/assignments/update-status/${id}/${status}`);
};

export default {
  detail,
  create,
  update,
  accept,
  disable,
  updateDetail,
  getCategories,
  createCategory,
  getSprints,
  getFilters,
  getBoard,
  updateStatus,
};
