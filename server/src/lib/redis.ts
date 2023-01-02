import Redis from "ioredis";
import { Logger } from "./logger";

const redis = new Redis(process.env.REDIS_URL);

const logger = new Logger("Redis");

redis.on("connect", () => {
  logger.info("🗄️  Redis connected");
});

redis.on("error", (error) => {
  logger.error(`🗄️  Redis connection failed, ${error.message}`);
});

export default redis;
