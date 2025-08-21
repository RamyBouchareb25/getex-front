import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Shared auth headers function
const getAuthHeaders = (session: any) => {
  if (session?.accessToken) {
    return { Authorization: `Bearer ${session.accessToken}` };
  } else if (session?.user?.id) {
    const token = Buffer.from(
      JSON.stringify({
        userId: session.user.id,
        role: session.user.role,
        email: session.user.email,
      })
    ).toString("base64");
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};
// Custom error class for HTTP errors
class HttpError extends Error {
  status: number;
  statusText?: string;
  data?: any;
  url?: string;

  constructor(
    message: string,
    status: number,
    statusText?: string,
    data?: any,
    url?: string
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.url = url;
  }
}
// Server-side axios instance with response interceptor
const serverAxios = axios.create({
  baseURL: process.env.BACKEND_URL || "/api",
});
// Setup server-side response interceptor
serverAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    const { response } = error;
    if (response) {
      const { status, statusText, data, config } = response;
      const errorMessage = (data as any)?.message || "An error occurred";
      const errorUrl = config?.url || "Unknown URL";
      throw new HttpError(errorMessage, status, statusText, data, errorUrl);
    }
    // If no response, it's a network error or similar
    return Promise.reject(error);
  }
);

// Server API helper with interceptor support
const serverApi = {
  async patch(url: string, data?: any) {
    const session = await getServerSession(authOptions);
    const headers = getAuthHeaders(session);
    // If data is FormData, don't set Content-Type header (let browser set it with boundary)
    if (data instanceof FormData) {
      return serverAxios.patch(url, data, {
        headers,
      });
    }
    return serverAxios.patch(url, data, {
      headers,
    });
  },
  async get(url: string, config?: any) {
    const session = await getServerSession(authOptions);
    return serverAxios.get(url, {
      headers: getAuthHeaders(session),
      ...config,
    });
  },

  async post(url: string, data?: any) {
    const session = await getServerSession(authOptions);
    const headers = getAuthHeaders(session);

    // If data is FormData, don't set Content-Type header (let browser set it with boundary)
    if (data instanceof FormData) {
      return serverAxios.post(url, data, {
        headers,
      });
    }

    return serverAxios.post(url, data, {
      headers,
    });
  },

  async put(url: string, data?: any) {
    const session = await getServerSession(authOptions);
    const headers = getAuthHeaders(session);

    // If data is FormData, don't set Content-Type header (let browser set it with boundary)
    if (data instanceof FormData) {
      return serverAxios.put(url, data, {
        headers,
      });
    }

    return serverAxios.put(url, data, {
      headers,
    });
  },

  async delete(url: string) {
    const session = await getServerSession(authOptions);
    return serverAxios.delete(url, {
      headers: getAuthHeaders(session),
    });
  },
};

export { serverApi };