import 'fastify';
import Redis from 'ioredis';
import { IpModel } from './models/ip.model';

interface RedisInstance {
  client: Redis;
}
declare module 'fastify' {
  interface FastifyInstance {
    redis:  RedisInstance;
    db: { models: { Ip: typeof IpModel; } }
    config: {
      PORT: number;
      MONGO_USER: string;
      MONGO_DB_NAME: string;
      MONGO_PASSWORD: string;
      REDIS_URI: string;
    };
  }
}




