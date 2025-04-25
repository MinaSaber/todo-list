import { Request, Response, NextFunction } from "express";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../exceptions/index.js";
import { UsersService } from "./users.service.js";
import { UpdateUserDto } from "./update-user.schema.js";

export const UsersController = {
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      if (userId !== req.user.id)
        return next(
          new ForbiddenException("You don't have access to do this action.")
        );
      const user = await UsersService.getUserById(userId);
      if (!user) return next(new NotFoundException("User not found"));

      res.json(user);
    } catch (error: any) {
      next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.params.id;
      const newUserData: UpdateUserDto = req.body;

      if (userId !== req.user.id)
        return next(
          new ForbiddenException("You don't have access to do this action.")
        );

      const user = await UsersService.getUserById(userId);

      if (!user) return next(new NotFoundException("User not found"));

      const isEmailAssociatedWithAnotherUser =
        await UsersService.isEmailAssociatedWithAnotherUser(
          userId,
          newUserData.email
        );

      if (isEmailAssociatedWithAnotherUser)
        return next(new BadRequestException("Cannot use this email."));

      await UsersService.updateUser(userId, newUserData);

      res
        .status(200)
        .json({ message: "User updated successfully", id: user.id });
    } catch (error: any) {
      next(error);
    }
  },
};
