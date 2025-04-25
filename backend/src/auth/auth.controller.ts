import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { BadRequestException } from "../exceptions/index.js";
import { UsersService } from "../users/users.service.js";
import { TokenService } from "../helpers/token-service.js";
import { LoginDto } from "./login.schema.js";

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, phone } = req.body;
      const existingUser = await UsersService.isUserExistByEmail(email);

      if (existingUser)
        return next(new BadRequestException("Email already exist"));

      const user = await AuthService.createUser(name, email, password, phone);

      res
        .status(201)
        .json({ message: "User registered successfully", id: user.id });
    } catch (error: any) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: LoginDto = req.body;

      const token = await AuthService.login(userData);

      TokenService.setTokenCookie(token, res);

      res.status(200).json("User logged in successfully.");
    } catch (error: any) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      TokenService.removeTokenCookie(res);

      res.status(200).json({ message: "User logged out successfully." });
    } catch (error: any) {
      next(error);
    }
  },
};
