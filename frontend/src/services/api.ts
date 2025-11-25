import axios from "axios";
import {
  AuthResponse,
  SignUpData,
  SignInData,
  Task,
  TasksResponse,
  TaskFormData,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (userData: SignUpData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/signup",
      userData
    );
    return response.data;
  },
  signin: async (credentials: SignInData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/signin",
      credentials
    );
    return response.data;
  },
};

// Task API
export const taskAPI = {
  getTasks: async (
    page: number = 1,
    limit: number = 10,
    status: string = "all"
  ): Promise<TasksResponse> => {
    const params: Record<string, string | number> = { page, limit };
    if (status !== "all") {
      params.status = status;
    }
    const response = await axiosInstance.get<TasksResponse>("/tasks", {
      params,
    });
    return response.data;
  },
  getTask: async (id: string): Promise<Task> => {
    const response = await axiosInstance.get<Task>(`/tasks/${id}`);
    return response.data;
  },
  createTask: async (taskData: TaskFormData): Promise<Task> => {
    const response = await axiosInstance.post<Task>("/tasks", taskData);
    return response.data;
  },
  updateTask: async (id: string, taskData: TaskFormData): Promise<Task> => {
    const response = await axiosInstance.put<Task>(`/tasks/${id}`, taskData);
    return response.data;
  },
  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
      `/tasks/${id}`
    );
    return response.data;
  },
};

export default axiosInstance;
