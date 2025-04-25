export const config = {
  jwtSecret: process.env.JWT_SECRET || "",
  nodeEnv: process.env.NODE_ENV || "development",
  redisUrl: process.env.REDIS_URL,
  redisToken: process.env.REDIS_TOKEN,
};
