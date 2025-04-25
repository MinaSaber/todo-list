import axios from "axios";
import { Task } from "../types/dtos";
import { CreateTaskDto } from "../types/create-task.dto";
import { CreateListDto } from "../types/create-list.dto";
import { UpdateUserDto } from "../types/update-user.dto";
import { TaskStatus } from "../types/task-status.enum";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const register = async (
  name: string,
  email: string,
  password: string,
  phone: string
) => {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
    phone,
  });
  return data;
};

export const login = async (email: string, password: string) => {
  return await api.post(
    "/auth/login",
    { email, password },
    { withCredentials: true }
  );
};
export const logout = async () => {
  return await api.post("/auth/logout", {}, { withCredentials: true });
};
export const getProfile = async () => {
  return await api.get("/auth/profile", { withCredentials: true });
};
export const getUserInfo = async (userId: string) => {
  return await api.get(`/users/${userId}`, { withCredentials: true });
};
export const updateUser = async (userId: string, userData: UpdateUserDto) => {
  return await api.put(`/users/${userId}`, userData, { withCredentials: true });
};
export const fetchTasks = async () => {
  const { data } = await api.get<Task[]>("/tasks", { withCredentials: true });
  return data;
};

export const addTask = async (task: CreateTaskDto) => {
  const { data } = await api.post<Task>("/tasks", task, {
    withCredentials: true,
  });
  return data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`, {
    withCredentials: true,
  });
};

export const toggleTaskStatus = async (id: string, status: TaskStatus) => {
  const { data } = await api.patch(
    `/tasks/${id}/status`,
    {
      status: status.toUpperCase(),
    },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const getLists = async () => {
  const { data } = await api.get("/lists", { withCredentials: true });
  return data;
};

export const addList = async (list: CreateListDto) => {
  const { data } = await api.post("lists", list, { withCredentials: true });
  return data;
};

export const getListWithTasks = async (listId: string) => {
  const { data } = await api.get(`/lists/${listId}/tasks`, {
    withCredentials: true,
  });
  return data;
};

export const updateTask = async (taskId: string, task: CreateTaskDto) => {
  const { data } = await api.put(`/tasks/${taskId}`, task, {
    withCredentials: true,
  });
  return data;
};

export default api;
