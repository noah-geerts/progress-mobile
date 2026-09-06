import { useAuth0 } from "react-native-auth0";
import axios, { type AxiosInstance } from "axios";
import { createContext, useContext } from "react";

const ApiContext = createContext<AxiosInstance | null>(null);

export function useApi(): AxiosInstance {
  const api = useContext(ApiContext);
  if (api === null) {
    throw new Error("useApi called outside of ApiProvider");
  }
  return api;
}

export default function ApiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getCredentials } = useAuth0();

  const api = axios.create({
    baseURL: "http://localhost:3000", // TODO UPDATE TO USE ENV
    withCredentials: true,
  });

  api.interceptors.request.use(
    async (request) => {
      const accessToken = (await getCredentials()).accessToken;
      if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
      }
      return request;
    },
    (error) => Promise.reject(error)
  );

  return <ApiContext value={api}>{children}</ApiContext>;
}
