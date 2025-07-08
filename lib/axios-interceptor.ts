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

// Server-side axios instance with response interceptor
const serverAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
});

// Setup server-side response interceptor
serverAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
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

export { clientAxios, serverApi };
