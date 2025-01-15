import fastifyPlugin from 'fastify-plugin';
import Redis from 'ioredis';
import type { FastifyInstance, FastifyPluginAsync, HookHandlerDoneFunction } from 'fastify';

import { CustomFastifyInstance } from '../interfaces';

const redisPlugin: FastifyPluginAsync = async (fastify: any) => {
  const {
    config: {
      REDIS_URI
    }
  } = fastify as unknown as CustomFastifyInstance;
  const redisClient = new Redis(REDIS_URI);

  redisClient.on('connect', () => {
    fastify.log.info('Connected to Redis');
  });

  redisClient.on('error', (error) => {
    fastify.log.error('Redis connection error:', error.message);
  });

  fastify.decorate('redis', { client: redisClient });

  fastify.addHook('onClose', async(_instance: FastifyInstance, done: HookHandlerDoneFunction) => {
      fastify.log.info('Closing Redis connection');
      await redisClient.quit();
      done();
  });
};

export default fastifyPlugin(redisPlugin);
