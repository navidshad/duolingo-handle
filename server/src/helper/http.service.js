const axios = require("axios");

module.exports.postData = (url = "", body = {}, headers = {}) => {
  return axios.default
    .post(url, body, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    })
    .then((response) => response.data);

  // return fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       ...headers
  //     },
  //     body: JSON.stringify(body)
  //   })
  //   .then(response => response.json())
};
