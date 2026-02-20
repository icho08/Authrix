import axios from 'axios';
import { logger } from '../config/logger.js';

const URLSCAN_API_KEY = process.env.URL_SCAN_API_KEY;
const BASE_URL = 'https://urlscan.io/api/v1';

export const submitScan = async (url: string, visibility: 'public' | 'unlisted' | 'private' = 'public') => {
  try {
    if (!URLSCAN_API_KEY) {
      throw new Error('URL_SCAN_API_KEY is not configured');
    }

    const response = await axios.post(
      `${BASE_URL}/scan/`,
      {
        url,
        visibility,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'API-Key': URLSCAN_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    logger.error(`Error submitting scan to urlscan.io: ${error.message}`);
    if (error.response) {
      logger.error(`urlscan.io response: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

export const getScanResult = async (uuid: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/result/${uuid}/`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching scan result from urlscan.io: ${error.message}`);
    throw error;
  }
};
