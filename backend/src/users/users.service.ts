import User from "./user.model.js";
import { UpdateUserDto } from "./update-user.schema.js";
import redis from "../helpers/redis.js";

const TTL_SECONDS = 60 * 5;

export const UsersService = {
  async getUserById(id: string) {
    const cacheKey = `user:${id}`;
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

    const user = await User.findById({ _id: id }).select(
      "_id name email phone"
    );

    await redis.set(cacheKey, JSON.stringify(user), { ex: TTL_SECONDS });
    return user;
  },

  async getUserByEmail(email: string) {
    return User.findOne({ email });
  },

  async isUserExistByEmail(email: string) {
    return await User.findOne({ email }).select("_id email");
  },

  async updateUser(id: string, userData: UpdateUserDto) {
    const updatedUser = await User.updateOne({ _id: id }, { $set: userData });
    await redis.del(`user:${id}`);
    return updatedUser;
  },

  async isEmailAssociatedWithAnotherUser(id: string, email: string) {
    return User.findOne({ email, _id: { $ne: id } });
  },
};
