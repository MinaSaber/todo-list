import bcrypt from "bcrypt";
import User from "../users/user.model.js";
import { UsersService } from "../users/users.service.js";
import {
  NotFoundException,
  UnauthorizedException,
} from "../exceptions/index.js";
import { LoginDto } from "./login.schema.js";
import { TokenService } from "../helpers/token-service.js";

export const AuthService = {
  async login(userData: LoginDto): Promise<string> {
    const user = await UsersService.getUserByEmail(userData.email);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    };
    return TokenService.generateAccessToken(payload);
  },

  async createUser(
    name: string,
    email: string,
    password: string,
    phone: string
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });
  },
};
