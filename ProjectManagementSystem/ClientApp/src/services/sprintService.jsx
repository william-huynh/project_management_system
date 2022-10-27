import axios from "axios";

const API_URL = "/api";

const detail = (id) => {
  return axios.get(API_URL + `/sprints/detail/${id}`);
};

const create = (data) => {
  return axios.post(API_URL + "/sprints/create", data);
};

const update = (id, data) => {
  return axios.put(API_URL + `/sprints/update/${id}`, data);
};

const disable = (id) => {
  return axios.put(API_URL + `/sprints/disable/${id}`);
};

const projectDetail = (id) => {
  return axios.get(API_URL + `/sprints/project-detail/${id}`);
};

const createDetail = (id) => {
  return axios.get(API_URL + `/sprints/create-detail/${id}`);
};

const updateDetail = (projectId, sprintId) => {
  return axios.get(API_URL + `/sprints/update-detail/${projectId}/${sprintId}`);
};

export default {
  detail,
  create,
  update,
  disable,
  projectDetail,
  createDetail,
  updateDetail,
};
