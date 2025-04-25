import { NextFunction, Request, Response } from "express";
import { ListsService } from "./lists.service.js";
import { ListDto } from "./list.schema.js";

export const ListsController = {
  async createList(req: Request, res: Response, next: NextFunction) {
    const listData: ListDto = req.body;
    const list = await ListsService.createList(req.user.id, listData);
    res.status(201).json(list);
  },

  async getAllLists(req: Request, res: Response, next: NextFunction) {
    const userId: string = req.user.id;
    const lists = await ListsService.getAllLists(userId);
    res.json(lists);
  },

  async getListTasks(req: Request, res: Response, next: NextFunction) {
    const listId: string = req.params.id;
    const userId: string = req.user.id;
    const listWithTasks = await ListsService.getListWithTasks(userId, listId);
    res.json(listWithTasks);
  },
};
