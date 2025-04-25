import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://top-aphid-28802.upstash.io",
  token: "AXCCAAIjcDE1ODk3NDMyNjRhNDA0OWU1YWIzOTk5ZmNlOGU1NTY1NHAxMA",
});

export default redis;
