const base_url = process.env.REACT_APP_BASE_URL

const api_base_url = process.env.REACT_APP_API_BASE_URL;

const endpoints = {
  files: `${api_base_url}/api/v1/files`,
  chat: `${api_base_url}/api/v1/chat`,
  convs: `${api_base_url}/api/v1/convs`,
  users: `${api_base_url}/api/v1/users`,
};

export {base_url, api_base_url, endpoints};
