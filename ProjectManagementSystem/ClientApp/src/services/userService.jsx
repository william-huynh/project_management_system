import axios from "axios";

const API_URL = "/api";

const create = (data) => {
    return axios.post(API_URL + "/users/create-user", data);
};
const update = (id,data) => {
  return axios.put(API_URL + `/users/update/${id}`, data);
};
const getDetail = (id) => {
  return axios.get(API_URL + `/users/update-detail/${id}`);
};
const disableUser = (id) => {
  return axios.put(API_URL + `/users/disable-user/${id}`);

}
export default {
  create,
  update,
  getDetail,
  getValid,
  disableUser
}