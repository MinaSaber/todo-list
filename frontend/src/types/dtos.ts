import { TaskPriority } from "./task-priority.enum";
import { TaskStatus } from "./task-status.enum";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AuthContextType {
  user: any;
  setUser: (user: User | null) => void;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  listId?: any;
  priority: TaskPriority;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phone: string;
}
