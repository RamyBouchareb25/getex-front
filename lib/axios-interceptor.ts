import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { validateEnvironment, logEnvironmentStatus } from "./env-validation";

// Log environment status on module load
logEnvironmentStatus();

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
  timeout: 30000, // 30 seconds timeout
});

// Add request interceptor for debugging
serverAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    console.log('Headers:', JSON.stringify(config.headers, null, 2));
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Setup server-side response interceptor
serverAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ Response ${response.status} from: ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    console.error('❌ Response interceptor error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    
    const { response } = error;
    if (response) {
      const { status, statusText, data, config } = response;
      const errorMessage = (data as any)?.message || `HTTP ${status}: ${statusText}`;
      const errorUrl = `${config?.baseURL || ''}${config?.url || ''}`;
      throw new HttpError(errorMessage, status, statusText, data, errorUrl);
    }
    
    // Network errors or other issues
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new HttpError(
        `Network error: Unable to connect to ${error.config?.baseURL || 'backend server'}`,
        0,
        'NETWORK_ERROR',
        { originalError: error.message },
        error.config?.url
      );
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
    
    try {
      // If data is FormData, don't set Content-Type header (let browser set it with boundary)
      if (data instanceof FormData) {
        return serverAxios.patch(url, data, {
          headers,
        });
      }
      return serverAxios.patch(url, data, {
        headers,
      });
    } catch (error) {
      console.error(`❌ PATCH ${url} failed:`, error);
      throw error;
    }
  },

  async get(url: string, config?: any) {
    const session = await getServerSession(authOptions);
    
    try {
      return serverAxios.get(url, {
        headers: getAuthHeaders(session),
        ...config,
      });
    } catch (error) {
      console.error(`❌ GET ${url} failed:`, error);
      throw error;
    }
  },

  async post(url: string, data?: any) {
    const session = await getServerSession(authOptions);
    const headers = getAuthHeaders(session);

    try {
      // If data is FormData, don't set Content-Type header (let browser set it with boundary)
      if (data instanceof FormData) {
        return serverAxios.post(url, data, {
          headers,
        });
      }

      return serverAxios.post(url, data, {
        headers,
      });
    } catch (error) {
      console.error(`❌ POST ${url} failed:`, error);
      throw error;
    }
  },

  async put(url: string, data?: any) {
    const session = await getServerSession(authOptions);
    const headers = getAuthHeaders(session);

    try {
      // If data is FormData, don't set Content-Type header (let browser set it with boundary)
      if (data instanceof FormData) {
        return serverAxios.put(url, data, {
          headers,
        });
      }

      return serverAxios.put(url, data, {
        headers,
      });
    } catch (error) {
      console.error(`❌ PUT ${url} failed:`, error);
      throw error;
    }
  },

  async delete(url: string) {
    const session = await getServerSession(authOptions);
    
    try {
      return serverAxios.delete(url, {
        headers: getAuthHeaders(session),
      });
    } catch (error) {
      console.error(`❌ DELETE ${url} failed:`, error);
      throw error;
    }
  },
};

export { serverApi };
