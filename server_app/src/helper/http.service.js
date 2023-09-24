const axios = require("axios");

module.exports.httpsClient = axios.default;

module.exports.postData = (url = "", body = {}, headers = {}) => {
  return axios.default
    .post(url, body, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    })
    .then((response) => response.data);
};

module.exports.getData = (url = "", headers = {}) => {
  return axios.default
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    })
    .then((response) => response.data);
};
