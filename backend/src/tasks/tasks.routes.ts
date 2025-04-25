import { Router } from "express";
import validate from "../middlewares/validate.js";
import AuthMiddleware from "../auth/auth.middleware.js";
import { TasksController } from "./tasks.controller.js";
import { TaskSchema } from "./task.schema.js";

const router = Router();

router.post(
  "/",
  AuthMiddleware,
  validate(TaskSchema),
  TasksController.createTask
);
router.get("/", AuthMiddleware, TasksController.getUserTasks);
router.put(
  "/:id",
  AuthMiddleware,
  validate(TaskSchema),
  TasksController.updateTask
);
router.patch("/:id/status", AuthMiddleware, TasksController.updateTaskStatus);
router.delete("/:id", AuthMiddleware, TasksController.deleteTask);

export default router;
