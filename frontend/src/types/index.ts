export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "Completed";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  totalTasks: number;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  token: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

export interface SignInData {
  email: string;
  password: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: "Pending" | "Completed";
}
