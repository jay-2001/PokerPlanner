import axios from 'axios';

const service = axios.create({
  baseURL: process.env.REACT_APP_PROXY_SERVER,
});
service.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Token ${token}` : '';
  return config;
});

export default service;
