export const config = {
  jwtSecret: process.env.JWT_SECRET || "",
  nodeEnv: process.env.NODE_ENV || "development",
  redisHost: process.env.REDIS_HOST || "localhost",
};
