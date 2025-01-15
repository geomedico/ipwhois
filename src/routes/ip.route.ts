import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import { IPLookupController } from './../controller/ip-lookup.controller';
import { CustomFastifyInstance } from './../interfaces';

const paramSchema = {
  type: 'object',
  required: ['ip'],
  properties: {
    ip: { type: 'string' },
  },
};

export default async function ipRoutes(fastify: any) {

  const ipRoute = new IPLookupController(fastify as CustomFastifyInstance);
  // Ip Routes
  fastify.post(
    '/:ip',
    { schema: { params: paramSchema } },
    ipRoute.getLookupIP.bind(ipRoute)
  );
  fastify.delete(
    '/:ip',
    { schema: { params: paramSchema } },
    ipRoute.deleteByIP.bind(ipRoute)
  );
  
  fastify.get('/health', ( request: FastifyRequest, reply: FastifyReply)  => {
    reply.code(200).send({ status: 'OK' });
  });
}