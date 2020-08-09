import axios from 'axios';

const api = axios.create({
    baseURL: "http://192.168.3.101:3777",
});

export default api;
