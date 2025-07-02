import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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

// Client-side axios instance
const clientAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
});

// Setup client-side interceptor
if (typeof window !== "undefined") {
  clientAxios.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const session = await getSession();
      const authHeaders = getAuthHeaders(session);

      // Apply auth headers
      Object.assign(config.headers, authHeaders);

      return config;
    },
    (error: any) => Promise.reject(error)
  );

  clientAxios.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      //   if (error.response?.status === 401) {
      //     console.log("401 Unauthorized - Signing out user");
      //     await signOut({ callbackUrl: "/login" });
      //   }
      return Promise.reject(error);
    }
  );
}

// Simplified server API helper - no interceptors needed
const serverApi = {
  async patch(url: string, data?: any) {
    const session = await getServerSession(authOptions);
    const headers = getAuthHeaders(session);
    // If data is FormData, don't set Content-Type header (let browser set it with boundary)
    if (data instanceof FormData) {
      return axios.patch(url, data, {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
        headers,
      });
    }
    return axios.patch(url, data, {
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
      headers,
    });
  },
  async get(url: string) {
    const session = await getServerSession(authOptions);
    return axios.get(url, {
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
      headers: getAuthHeaders(session),
    });
  },

  async post(url: string, data?: any) {
    const session = await getServerSession(authOptions);
    const headers = getAuthHeaders(session);

    // If data is FormData, don't set Content-Type header (let browser set it with boundary)
    if (data instanceof FormData) {
      return axios.post(url, data, {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
        headers,
      });
    }

    return axios.post(url, data, {
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
      headers,
    });
  },

  async put(url: string, data?: any) {
    const session = await getServerSession(authOptions);
    const headers = getAuthHeaders(session);

    // If data is FormData, don't set Content-Type header (let browser set it with boundary)
    if (data instanceof FormData) {
      return axios.put(url, data, {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
        headers,
      });
    }

    return axios.put(url, data, {
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
      headers,
    });
  },

  async delete(url: string) {
    const session = await getServerSession(authOptions);
    return axios.delete(url, {
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
      headers: getAuthHeaders(session),
    });
  },
};

export { clientAxios, serverApi };
