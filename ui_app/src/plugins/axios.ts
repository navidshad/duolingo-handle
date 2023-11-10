"use strict";
import axios from "axios";
import { useToast } from "vue-toastification";

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
    let errorMsg = "";

    if (typeof error.response?.data == "string")
      errorMsg = error.response?.data;
    else if (error.response?.data.message)
      errorMsg = error.response?.data.message;
    else errorMsg = "Something went wrong!";

    useToast().error(errorMsg);

    return Promise.reject(errorMsg);
  }
);

export const httpClient = _axios;
