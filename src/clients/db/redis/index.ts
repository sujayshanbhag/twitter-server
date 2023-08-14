import Redis from "ioredis"

export const redisClient = new Redis(
    "redis://default:2982db62df304a4c9e2661da57c1683f@us1-funky-hyena-39194.upstash.io:39194"
);
