// src/config.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const endpoints = {
  files: `${API_BASE_URL}/api/v1/files`,
  chat: `${API_BASE_URL}/api/v1/chat`,
  convs: `${API_BASE_URL}/api/v1/convs`,
  users: `${API_BASE_URL}/api/v1/users`,
};

export default endpoints;
