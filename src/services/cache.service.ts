import { CustomFastifyInstance } from './../interfaces';

export class CacheService {
  private fastify: CustomFastifyInstance;

  constructor(fastify: CustomFastifyInstance) {
    this.fastify = fastify;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.fastify.redis.client.set(key, value, 'EX', ttl);
      } else {
        await this.fastify.redis.client.set(key, value);
      }

      this.fastify.log.info(`CacheService: set: ip : ${key}`);
    } catch (error) {
      this.fastify.log.error(
        `Failed to set cache for key "${key}":`,
        error.message
      );
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.fastify.redis.client.get(key);
    } catch (error) {
      this.fastify.log.error(
        `Failed to get cache for key "${key}":`,
        error.message
      );
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.fastify.redis.client.del(key);
    } catch (error) {
      this.fastify.log.error(
        `Failed to delete cache for key "${key}":`,
        error.message
      );
      throw error;
    }
  }
}
