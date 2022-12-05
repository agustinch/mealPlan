import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { apiInstance } from "./base.service";

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
  status: string;
}

type Options = { body?: any; env?: string; token?: string };

export type ApiError<T> = AxiosError<ApiResponse<T>>;

const api = async <T>(
  method: AxiosRequestConfig["method"],
  url: string,
  options?: Options
) => {
  const result = await apiInstance({
    method,
    url,
    params: method === "get" ? options?.body : undefined,
    data: method !== "get" ? options?.body : undefined,
  })
    .then((response: AxiosResponse<T>) => {
      return response.data;
    })
    .catch((error: ApiError<T>) => {
      throw error;
    });

  return result;
};

export default {
  get: <T = any>(url: string, options?: Options): Promise<T> =>
    api<T>("get", url, options),
  post: <T = any>(url: string, options?: Options) =>
    api<T>("post", url, options),
  put: <T = any>(url: string, options?: Options) => api<T>("put", url, options),
  patch: <T = any>(url: string, options?: Options) =>
    api<T>("patch", url, options),
  delete: <T = any>(url: string, options?: Options) =>
    api<T>("delete", url, options),
};
