import List from "./list.model.js";
import Task from "../tasks/task.model.js";
import { NotFoundException } from "../exceptions/index.js";
import { ListDto } from "./list.schema.js";
import redis from "../helpers/redis.js";

const TTL_SECONDS = 60 * 10;

export const ListsService = {
  async createList(userId: string, listData: ListDto) {
    return List.create({
      userId,
      name: listData.name,
      color: listData.color,
    });
  },

  async getAllLists(userId: string) {
    const lists = await List.find({ userId });

    const listsWithCounts = await Promise.all(
      lists.map(async (list) => {
        const count = await Task.countDocuments({ listId: list._id });
        return {
          ...list.toObject(),
          taskCount: count,
        };
      })
    );

    return listsWithCounts;
  },

  async getListWithTasks(userId: string, listId: string) {
    const cacheKey = `listWithTasks:${userId}:${listId}`;
    const cached: any = await redis.get(cacheKey);

    if (cached) {
      if (typeof cached === "string") {
        try {
          return JSON.parse(cached);
        } catch (err) {
          return null;
        }
      } else {
        return cached;
      }
    }

    const list = await List.findOne({ _id: listId, userId });

    if (!list) {
      throw new NotFoundException("List not found.");
    }

    const tasks = await Task.find({ listId }).sort({ createdAt: -1 });

    const result = {
      ...list.toObject(),
      tasks,
    };

    await redis.set(cacheKey, JSON.stringify(result), { ex: TTL_SECONDS });

    return result;
  },

  async isListExist(userId: string, listId: string) {
    const list = await List.findOne({ _id: listId, userId });
    return !!list;
  },
};

export default ListsService;
