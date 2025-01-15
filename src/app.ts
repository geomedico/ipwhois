import Fastify from 'fastify';
import envPlugin from '@fastify/env';
import path from 'path';

import { CustomFastifyInstance } from './interfaces';
import MongoDbPlugin from './plugins/mongo-db.plugin';
import RedisDbPlugin from './plugins/redis-db.plugin';
import { CacheRefreshJob } from './jobs/cache-refresh.job';
import ipRoutes from './routes/ip.route';

const envSchema = {
  type: 'object',
  required: ['MONGO_PASSWORD', 'MONGO_USER', 'MONGO_DB_NAME', 'REDIS_URI', 'PORT', 'CACHE_TTL'],
  properties: {
    PORT: { type: 'integer', default: 3000 },
    CACHE_TTL:  { type: 'integer', default: 60 },
    MONGO_USER: { type: 'string' },
    MONGO_DB_NAME: { type: 'string' },
    MONGO_PASSWORD: { type: 'string' },
    REDIS_URI: { type: 'string' },
  }
};

const envOptions = {
  confKey: 'config',
  schema: envSchema,
  dotenv: {
    path: path.join(__dirname, '../', '.env'),
  }
};

const fastify = Fastify({ logger: true }) as unknown as CustomFastifyInstance;
fastify.register(envPlugin, envOptions);
fastify.register(MongoDbPlugin);
fastify.register(RedisDbPlugin);
fastify.register(ipRoutes, { prefix: '/lookup' });

let isInitialized = false;

const app = {
  async ready() {
    if (!isInitialized) {
      try {
        await fastify.ready();
        const PORT = fastify.config.PORT;

        await CacheRefreshJob.init(fastify);
        await fastify.listen({ port: PORT, host: '0.0.0.0' });

        isInitialized = true;
        console.log(`Server is running at http://localhost:${PORT}`);
        
      } catch (err) {
        fastify.log.error(err);
        process.exit(1);
      }
    }
  },

  async close() {
    if (isInitialized) {
      await fastify.close();

      console.log('Server has been shut down.');
      isInitialized = false;
    }
  },

  get server() {
    return fastify.server;
  },

  get config() {
    return fastify.config;
  },
};

if (require.main === module) {
  app.ready();
}