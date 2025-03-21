import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

// Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: any;
}

interface ErrorResponseData {
  message?: string;
  errors?: any;
}

// Default config
const defaultConfig: AxiosRequestConfig = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance with default config
const createAxiosInstance = (
  config: AxiosRequestConfig = {},
): AxiosInstance => {
  const instance = axios.create({
    ...defaultConfig,
    ...config,
  });

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError<ErrorResponseData>) => {
      // Handle common errors
      if (error.response) {
        // Server responded with error status
        const errorResponse: ApiError = {
          message: error.response.data?.message || 'An error occurred',
          status: error.response.status,
          errors: error.response.data?.errors,
        };
        return Promise.reject(errorResponse);
      } else if (error.request) {
        // Request was made but no response received
        return Promise.reject({
          message: 'No response received from server',
          status: 0,
        });
      } else {
        // Something else happened
        return Promise.reject({
          message: error.message || 'An error occurred',
          status: 0,
        });
      }
    },
  );

  return instance;
};

// API methods
export class ApiClient {
  private instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.instance = createAxiosInstance(config);
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<T>(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<T>(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }
}

// Create default instance
export const apiClient = new ApiClient();

// Export types
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError };
