import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { Response } from "express";

type Payload = {
  id: string;
  email: string;
  name: string;
  phone: string;
};

export const TokenService = {
  generateAccessToken: (payload: Payload) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
  },

  async setTokenCookie(token: string, res: Response) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });
  },

  removeTokenCookie(res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
    });
  },
};
