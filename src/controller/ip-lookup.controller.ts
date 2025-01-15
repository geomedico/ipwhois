import type { FastifyRequest, FastifyReply } from 'fastify';
import { CustomFastifyInstance, IResOutPut } from './../interfaces';

import { IPLookupService } from './../services/ip-lookup.service';

export class IPLookupController {
  private fastify: CustomFastifyInstance;
  private ipLookupService: IPLookupService;

  constructor(fastify: CustomFastifyInstance) {
    this.fastify = fastify;
    this.ipLookupService = new IPLookupService(fastify);
  }

  async getLookupIP(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<IResOutPut> {
    const { ip } = request.params as { ip: string };
    const data = await this.ipLookupService.lookupIP(ip);

    return reply.send({ status: 1, data });
  }

  async deleteByIP(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<IResOutPut> {
    const { ip } = request.params as { ip: string };
    await this.ipLookupService.deleteCache(ip);

    return reply.send({ status: 1 });
  }
}
