import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/',
  headers: {
      'content-type': 'application/json',      
  },
});

//axiosInstance.interceptors.response.use(
//  (response) => response.data,
//  (error) => {
//    if (401 === error.response.status) {
//      window.location.href =
//        "/Identity/Account/Login?returnUrl=" + window.location.pathname;
//    } else {
//      return Promise.reject(error);
//    }
//});

export default axiosInstance;