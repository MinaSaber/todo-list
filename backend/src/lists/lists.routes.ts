import { Router } from "express";
import authMiddleware from "../auth/auth.middleware.js";
import validate from "../middlewares/validate.js";
import { ListSchema } from "./list.schema.js";
import { ListsController } from "./lists.controller.js";

const router = Router();

router.get("/", authMiddleware, ListsController.getAllLists);
router.post(
  "/",
  authMiddleware,
  validate(ListSchema),
  ListsController.createList
);
router.get("/:id/tasks", authMiddleware, ListsController.getListTasks);

export default router;
