export interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  department: string; // Main department (departments[0]) - for backward compatibility in frontend
  departments: string[]; // Array of departments, index 0 is the main department
  role: UserRole;
}

export type UserRole = "Intern" | "Department Head" | "Supervisor";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  departments: string[]; // Array of departments, index 0 is the main department
  role: UserRole;
}

export interface Announcement {
  _id: string;
  user: {
    _id: string;
    name: string;
    photo?: string;
  };
  title: string;
  message: string;
  departments: string[];
  createdAt: Date;
  expiresAt?: Date;
}

export interface Task {
  _id: string;
  role: UserRole;
  taskName: string;
  to: string;
  dayTime: string;
  department: string;
  subject: string;
  details: string;
  status: "pending" | "in-progress" | "completed";
  statusLog: Array<{
    userId: string;
    userName: string;
    status: "pending" | "in-progress" | "completed";
    proofOfCompletion?: {
      type: "image" | "link";
      value: string;
    };
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

export interface Theme {
  mode: "light" | "dark";
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
