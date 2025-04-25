import { Router } from "express";
import validate from "../middlewares/validate.js";
import { AuthController } from "./auth.controller.js";
import AuthMiddleware from "./auth.middleware.js";
import rateLimit from "express-rate-limit";
import { LoginSchema } from "./login.schema.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later.",
});

router.post(
  "/login",
  // loginLimiter,
  validate(LoginSchema),
  AuthController.login
);
router.post("/register", AuthController.register);
router.get("/profile", AuthMiddleware, (req, res) => {
  res.json({ user: req.user });
});
router.post("/logout", AuthMiddleware, AuthController.logout);

export default router;
