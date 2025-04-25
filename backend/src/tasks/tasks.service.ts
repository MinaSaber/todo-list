import { NotFoundException } from "../exceptions/index.js";
import { TaskStatus } from "../interfaces/task-status.enum.js";
import ListsService from "../lists/lists.service.js";
import Task from "./task.model.js";
import { TaskDto } from "./task.schema.js";

export const TaskService = {
  async createTask(userId: string, taskData: TaskDto) {
    if (taskData.listId) {
      const listExists = await ListsService.isListExist(
        userId,
        taskData.listId
      );
      if (!listExists) {
        throw new NotFoundException("List does not exist.");
      }
    }
    return Task.create({
      userId,
      ...taskData,
    });
  },

  async getUserTasks(userId: string) {
    return Task.find({ userId: userId }).populate("listId");
  },

  async searchTasks(userId: string, searchQuery: string) {
    return Task.find({
      userId,
      title: { $regex: searchQuery, $options: "i" },
    });
  },

  async updateTask(taskId: string, taskData: TaskDto) {
    return Task.updateOne({ _id: taskId }, { $set: taskData });
  },

  async updateTaskStatus(taskId: string, status: TaskStatus) {
    return Task.updateOne(
      { _id: taskId },
      { status },
      {
        new: true,
      }
    );
  },

  async deleteTask(id: string) {
    return Task.deleteOne({ _id: id });
  },
};
