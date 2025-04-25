import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  BadRequestException,
  UnauthorizedException,
} from "../exceptions/index.js";
import { config } from "../helpers/config.js";

export default function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  if (!token) {
    return next(new UnauthorizedException("Unauthorized"));
  }

  try {
    const decoded: any = jwt.verify(token, config.jwtSecret);

    req.user = decoded;
    return next();
  } catch (error) {
    return next(new UnauthorizedException("Unauthorized"));
  }
}
