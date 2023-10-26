import axios from "axios";

import { createAxiosClient } from "./createAxiosClient";
import { useAuthStore } from "../src/stores/authStore";

const createClient = () => {
  const client = axios.create({
    baseURL: "http://localhost:3000",
  });

  client.interceptors.request.use(async (config) => {
    //   const token = useStore.getState().token

    //   config.headers = { ...config.headers } as AxiosHeaders
    //   config.headers.Authorization = `Bearer ${token}`
    return config;
  });

  return client;
};

export const client = createClient();
