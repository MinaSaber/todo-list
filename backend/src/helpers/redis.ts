import { Redis } from "@upstash/redis";
import { config } from "./config.js";

const redis = new Redis({
  url: config.redisUrl,
  token: config.redisToken,
});

export default redis;
