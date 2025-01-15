import { CustomFastifyInstance } from './../interfaces';
import { IpInfo } from '../models/ip.model';

export class IpDatabaseService {
  private fastify: CustomFastifyInstance;

  constructor(fastify: CustomFastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * Find an IP document by its IP address.
   * @param ip - The IP address to search for.
   * @returns The found document or null.
   */
  async findByIp(ip: string): Promise<IpInfo | null> {
    try {
      return await this.fastify.db.models.Ip.findOne({ ip });
    } catch (error) {
      console.error(`Error finding IP ${ip} in the database:`, error);
      throw new Error(`Could not retrieve IP ${ip} from the database.`);
    }
  }

  /**
   * Save a new IP document to the database.
   * @param ipData - The IP data to save.
   * @returns The saved document.
   */
  async save(ipData: Partial<IpInfo>): Promise<IpInfo> {
    try {
      const newIp = new this.fastify.db.models.Ip(ipData);
      return await newIp.save();
    } catch (error) {
      console.error('Error saving IP data to the database:', error);
      throw new Error('Could not save IP data to the database.');
    }
  }
}
