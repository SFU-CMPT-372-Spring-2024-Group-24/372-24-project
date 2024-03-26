import axios from "axios";

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    "x-requested-with": "XMLHttpRequest",
  },
});

export interface AxiosError extends Error {
  isAxiosError: boolean;
  response?: {
    data: {
      message: string;
    };
    status: number;
    headers: any;
    statusText: string;
  };
  request?: any;
}