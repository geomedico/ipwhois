import { CacheService } from './cache.service';
import { IpDatabaseService } from './ip-database.service';
import { IPWhoisService } from './ipwhois.service';
import { CacheRefreshJob } from './../jobs/cache-refresh.job'
import { IpInfo } from '../models/ip.model';
import { CustomFastifyInstance } from './../interfaces';

export class IPLookupService {
  private fastify: CustomFastifyInstance;
  private cacheService: CacheService;
  private ipDatabaseService: IpDatabaseService;
  private ipWhoisService: IPWhoisService;

  constructor(
    fastify: CustomFastifyInstance
  ) {
    this.fastify = fastify;
    this.cacheService = new CacheService(fastify);
    this.ipDatabaseService = new IpDatabaseService(fastify);
    this.ipWhoisService = new IPWhoisService();
  }

  async lookupIP(ip: string): Promise<IpInfo> {
    try {
      const { config: { CACHE_TTL: ttl } } = this.fastify || {};

      const cachedData = await this.cacheService.get(ip);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const dbData = await this.ipDatabaseService.findByIp(ip);
      if (dbData) {
        await this.cacheService.set(ip, JSON.stringify(dbData), ttl);
        return dbData;
      }

      const ipData = await this.ipWhoisService.fetchIPData(ip);
      const savedData = await this.ipDatabaseService.save(ipData);

      await this.cacheService.set(ip, JSON.stringify(savedData), ttl);
      await CacheRefreshJob.addJob(ip);

      this.fastify.log.info(`ip cached: ${ip}`)

      return savedData;
    } catch (err) {
      this.fastify.log.error(err);
      throw new Error(`Failed to lookup IP: ${err.message}`);
    }
  }

  async deleteCache(ip: string): Promise<void> {
    try {
      await this.cacheService.delete(ip);
      await CacheRefreshJob.removeJob(ip);
      this.fastify.log.info(`ip deleted: ${ip}`)
    } catch (err) {
      this.fastify.log.error(err);
    }
  }
}
