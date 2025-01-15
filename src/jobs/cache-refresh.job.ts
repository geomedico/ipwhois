import Bull, { Queue } from 'bull';

import { IpDatabaseService } from './../services/ip-database.service';
import { CacheService } from './../services/cache.service';
import { IPWhoisService } from '../services/ipwhois.service';
import { CacheJobData, CustomFastifyInstance } from './../interfaces';
import { IpInfo } from './../models/ip.model';

export class CacheRefreshJob {
  private static queue: Queue<CacheJobData>;
  private static cacheService: CacheService;
  private static mongoDbService: IpDatabaseService;
  private static ipLookupService: IPWhoisService;
  private static TTL: number = 60;

  static init(fastify: CustomFastifyInstance): void {
    const {
      config: { REDIS_URI: redisUrl, CACHE_TTL: ttl },
    } = fastify;
    this.TTL = ttl;
    this.queue = new Bull<CacheJobData>('cache-refresh', redisUrl);
    this.cacheService = new CacheService(fastify);
    this.mongoDbService = new IpDatabaseService(fastify);
    this.ipLookupService = new IPWhoisService();

    this.queue.process(async (job) => {
      try {
        const retrievedData = {} as Record<string, IpInfo | null>;
        const { ip } = job.data;
        retrievedData.ipData = await this.mongoDbService.findByIp(ip);
        if (!retrievedData.ipData) {
          retrievedData.ipData = await this.ipLookupService.fetchIPData(ip)!;
        }

        if (!retrievedData.ipData) {
          return Promise.reject(
            'bulls: broken retrieving lookup data services'
          );
        }

        await this.cacheService.set(
          ip,
          JSON.stringify(retrievedData.ipData),
          ttl
        );
        fastify.log.info(`job ip executed: ${ip}`);
      } catch (err) {
        fastify.log.error(err);
        process.exit(1);
      }
    });
  }

  static async addJob(ip: string): Promise<void> {
    try {
      const ttl = this.TTL;
      await this.queue.add(
        { ip },
        { jobId: ip, repeat: { every: ttl * 1000 } } // Use the IP as the jobId
      );
    } catch (err) {
      console.error(`Failed to add job for IP ${ip}:`, err);
    }
  }

  static async removeJob(ip: string): Promise<void> {
    try {
      const job = await this.queue.getJob(ip);
      if (job) {
        await job.remove();
        console.log(`Removed job for IP: ${ip}`);
      } else {
        console.log(`No job found for IP: ${ip}`);
      }
    } catch (err) {
      console.error(`Failed to remove job for IP ${ip}:`, err);
    }
  }
}
