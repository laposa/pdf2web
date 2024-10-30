import axios, { AxiosHeaders } from "axios";

const createClient = () => {
  const client = axios.create();

  client.interceptors.request.use(async (config) => {
    config.baseURL = window.pdf2webEditorConfig.apiUrl
    config.headers = { ...config.headers } as AxiosHeaders
    config.headers.Authorization = `Bearer ${window.pdf2webEditorConfig.apiKey}`
    return config;
  });

  return client;
};

export const client = createClient();
