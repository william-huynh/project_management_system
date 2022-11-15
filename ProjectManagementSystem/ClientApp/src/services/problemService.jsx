import axios from "axios";

const API_URL = "/api";

const detail = (id) => {
  return axios.get(API_URL + `/problems/detail/${id}`);
};

const create = (data) => {
  return axios.post(API_URL + "/problems/create", data);
};

const update = (id, data) => {
  console.log(data);
  return axios.put(API_URL + `/problems/update/${id}`, data);
};

const accept = (id) => {
  return axios.put(API_URL + `/problems/accept-problem/${id}`);
};

const disable = (id) => {
  return axios.put(API_URL + `/problems/disable/${id}`);
};

const updateDetail = (id) => {
  return axios.get(API_URL + `/problems/update-detail/${id}`);
};

const getCategories = (id) => {
  return axios.get(API_URL + `/problems/get-categories/${id}`);
};

const createCategory = (data) => {
  return axios.post(API_URL + "/problems/create-category", data);
};

const getSprints = (id) => {
  return axios.get(API_URL + `/problems/get-sprints/${id}`);
};

const getFilters = (id) => {
  return axios.get(API_URL + `/problems/get-filters/${id}`);
};

const getAssignments = () => {
  return axios.get(API_URL + "/problems/get-assignments");
};

const getBoard = (id) => {
  return axios.get(API_URL + `/problems/get-assigned-board/${id}`);
};

const updateStatus = (id, status) => {
  return axios.put(API_URL + `/problems/update-status/${id}/${status}`);
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
  getAssignments,
  getBoard,
  updateStatus,
};
