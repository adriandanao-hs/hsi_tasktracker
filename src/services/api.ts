import {
  LoginCredentials,
  RegisterData,
  User,
} from "../types";

export const getBaseUrl = () => process.env.REACT_APP_API_URL || "http://localhost:10533/api";
export const getAssetUrl = () => process.env.REACT_APP_API_URL?.replace('/api', '') || "http://localhost:10533";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const defaultHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: defaultHeaders,
  mode: "cors",
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new ApiError(response.status, error.message || "An error occurred");
  }
  return response.json();
}

export const apiService = {
  login: async (credentials: LoginCredentials) => {
    const response = await fetch(`${getBaseUrl()}/auth/login`, {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return handleResponse<{ user: User }>(response);
  },

  register: async (userData: RegisterData) => {
    const response = await fetch(`${getBaseUrl()}/auth/register`, {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify(userData),
    });
    return handleResponse<{ user: User }>(response);
  },

  logout: async () => {
    const response = await fetch(`${getBaseUrl()}/auth/logout`, {
      ...defaultOptions,
      method: "POST",
    });
    return handleResponse<{ message: string }>(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${getBaseUrl()}/user/me`, {
      ...defaultOptions,
      method: "GET",
    });
    return handleResponse<User>(response);
  },

  updatePhoto: async (photo: File) => {
    const formData = new FormData();
    formData.append("photo", photo);

    const response = await fetch(`${getBaseUrl()}/user/update-photo`, {
      credentials: "include",
      method: "POST",
      mode: "cors",
      body: formData,
    });
    return handleResponse<{ message: string; photo: string }>(response);
  },

  getInterns: async (userId: string) => {
    const response = await fetch(`${getBaseUrl()}/user/interns/${userId}`, {
      ...defaultOptions,
      method: "GET",
    });
    return handleResponse<User[]>(response);
  },
};
