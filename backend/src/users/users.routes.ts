import { Router } from "express";
import authMiddleware from "../auth/auth.middleware.js";
import validate from "../middlewares/validate.js";
import { updateUserSchema } from "./update-user.schema.js";
import { UsersController } from "../users/users.controller.js";

const router = Router();

router.get("/:id", authMiddleware, UsersController.getUserById);
router.put(
  "/:id",
  authMiddleware,
  validate(updateUserSchema),
  UsersController.updateUser
);

export default router;
