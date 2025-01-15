import type { FastifyInstance } from 'fastify';
import Redis from 'ioredis';
import { IpModel } from './../models/ip.model';

interface RedisInstance {
  client: Redis;
}
export interface CustomFastifyInstance extends FastifyInstance {
  redis: RedisInstance;
  db: { models: { Ip: typeof IpModel; } }
  config: {
    PORT: number;
    CACHE_TTL: number;
    MONGO_USER: string;
    MONGO_DB_NAME: string;
    MONGO_PASSWORD: string;
    REDIS_URI: string;
  };
}

export interface CacheJobData {
  ip: string;
}

export interface Models {
  Ip: typeof IpModel;
}

export interface IModels {
  models: Models;
}

export interface IResOutPut {
   status: number;
   message?: string;
   data?: Record<string, any>;
}