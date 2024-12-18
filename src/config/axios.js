import axios from "axios";

const api = axios.create({
    baseURL:"http://103.90.227.69:8080/api/", // define server backend url
});

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // chạy trc khi call api

    const token = localStorage.getItem("token");

    //set token cho api
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default api;
