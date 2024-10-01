import axios from "axios";

const api = axios.create({
    baseURL:"http://103.90.227.69:8080/api/"
});

export default api;