import axios, { AxiosHeaders } from "axios";

const createClient = () => {
  const client = axios.create({
    baseURL: "http://localhost:3000",
  });

  client.interceptors.request.use(async (config) => {
      config.headers = { ...config.headers } as AxiosHeaders
      config.headers.Authorization = `Bearer ${window.pdf2WebConfig.api_key}`
    return config;
  });

  return client;
};

export const client = createClient();
