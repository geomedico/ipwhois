import mongoose from 'mongoose';
import fastifyPlugin from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { IpModel } from './../models/ip.model';
import { CustomFastifyInstance, Models, IModels } from './../interfaces';

const connectToDb: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  const {
    config: { MONGO_USER, MONGO_DB_NAME, MONGO_PASSWORD },
  } = fastify as unknown as CustomFastifyInstance;

  const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongo-db:27017/${MONGO_DB_NAME}?authSource=admin`;
  try {
    await mongoose.connect(MONGO_URI);

    const models: Models = { Ip: IpModel };
    fastify.decorate<IModels>('db', { models });

    fastify.log.info('Connected to MongoDB');
  } catch (error) {
    fastify.log.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
};

export default fastifyPlugin(connectToDb);
