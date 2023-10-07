"use strict";
import axios from "axios";

// @ts-ignore
const _axios = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL || "",
});

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response.data.data;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export const httpClient = _axios;
