import axios from "axios";

const API_URL = "/api";

const detail = (id) => {
  return axios.get(API_URL + `/projects/detail/${id}`);
};

const create = (data) => {
  return axios.post(API_URL + "/projects/create-project", data);
};

const update = (id, data) => {
  return axios.put(API_URL + `/projects/update/${id}`, data);
};

const getUpdateDetail = (id) => {
  return axios.get(API_URL + `/projects/update-detail/${id}`);
};

const disable = (id) => {
  return axios.put(API_URL + `/projects/disable-project/${id}`);
};

export default {
  detail,
  create,
  update,
  getUpdateDetail,
  disable,
};
