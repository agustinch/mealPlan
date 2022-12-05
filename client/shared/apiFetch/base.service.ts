import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Router } from "next/router";

interface OriginalRequest extends AxiosRequestConfig {
  retry?: boolean;
}

export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  // eslint-disable-next-line consistent-return
  async (error: AxiosError): Promise<AxiosResponse<any>> => {
    const originalRequest: OriginalRequest | undefined = error.config || {};
    if (error.response?.status === 401 && !originalRequest?.retry) {
      originalRequest.retry = true;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );
        return apiInstance(originalRequest);
      } catch {
        originalRequest.retry = false;
        if (window) window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
