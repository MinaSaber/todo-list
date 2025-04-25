import { Request, Response, NextFunction } from "express";
import TaskModel from "./task.model.js";
import { NotFoundException } from "../exceptions/index.js";
import { TaskService } from "./tasks.service.js";
import { checkAuthority } from "../helpers/utils.js";

export const TasksController = {
  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskData = req.body;
      const task = await TaskService.createTask(req.user.id, taskData);
      res.status(201).json(task);
    } catch (error: any) {
      next(error);
    }
  },

  async getUserTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const tasks = await TaskService.getUserTasks(userId);
      res.json(tasks);
    } catch (error: any) {
      next(error);
    }
  },

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      const task = await TaskModel.findById(taskId);
      if (!task) return next(new NotFoundException("Task not found"));
      checkAuthority(userId, task.userId);
      await TaskService.updateTask(taskId, req.body);
      res.json("Task updated successfully.");
    } catch (error: any) {
      next(error);
    }
  },

  async updateTaskStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.id;
      const task = await TaskModel.findById(taskId);
      if (!task) return next(new NotFoundException("Task not found"));
      checkAuthority(req.user.id, task.userId);
      const { status } = req.body;
      await TaskService.updateTaskStatus(taskId, status);
      res.json("Task updated successfully.");
    } catch (error: any) {
      next(error);
    }
  },

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.id;
      const task = await TaskModel.findById(req.params.id);
      if (!task) return next(new NotFoundException("Task not found"));
      checkAuthority(req.user.id, task.userId);
      await TaskService.deleteTask(taskId);
      res.json({ message: "Task deleted successfully" });
    } catch (error: any) {
      next(error);
    }
  },
};
