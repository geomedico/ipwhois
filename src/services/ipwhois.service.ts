import axios from 'axios';

export class IPWhoisService {
  constructor() {}
  /**
   * Fetch IP data from the external IPWhois service.
   * @param ip - The IP address to fetch data for.
   * @returns The fetched IP data.
   * @throws Error if the external API call fails.
   */
  async fetchIPData(ip: string): Promise<any> {
    try {
      const response = await axios.get(`https://ipwhois.app/json/${ip}`);

      return response.data;
    } catch (error) {
      console.error(`Error fetching data for IP ${ip} from IPWhois:`, error);
      throw new Error(`Could not fetch data for IP ${ip} from IPWhois.`);
    }
  }
}
