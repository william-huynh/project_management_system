import axios from "axios";

const API_URL = "/api";

const detail = (id) => {
  return axios.get(API_URL + `/records/detail/${id}`);
};

const create = (data) => {
  return axios.post(API_URL + "/records/create-project", data);
};

const update = (id, data) => {
  return axios.put(API_URL + `/records/update/${id}`, data);
};

const getUpdateDetail = (id) => {
  return axios.get(API_URL + `/records/update-detail/${id}`);
};

const deleteUserRecord = (id) => {
  return axios.delete(API_URL + `/records/delete-user-record/${id}`);
};

export default {
  detail,
  create,
  update,
  getUpdateDetail,
  deleteUserRecord,
};
