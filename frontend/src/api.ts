import axios from "axios";

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    "x-requested-with": "XMLHttpRequest",
  },
});
