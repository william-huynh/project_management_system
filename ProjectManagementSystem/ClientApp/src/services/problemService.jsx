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

const disable = (id) => {
  return axios.put(API_URL + `/problems/disable/${id}`);
};

const updateDetail = (id) => {
  return axios.get(API_URL + `/problems/update-detail/${id}`);
};

const getCategories = () => {
  return axios.get(API_URL + "/problems/get-categories");
};

const createCategory = (data) => {
  return axios.post(API_URL + "/problems/create-category", data);
};

const getSprints = () => {
  return axios.get(API_URL + "/problems/get-sprints");
};

const getAssignments = () => {
  return axios.get(API_URL + "/problems/get-assignments");
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
  getAssignments,
};
