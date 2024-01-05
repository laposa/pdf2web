import axios from "axios";

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
