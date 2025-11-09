import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';

interface DeviceInfo {
  deviceName: string;
  browser: string;
  os: string;
  deviceType: string;
  location: string;
  ipAddress: string;
}

export const parseDeviceInfo = (userAgent: string, ipAddress: string): DeviceInfo => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  
  const geo = geoip.lookup(ipAddress);
  const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown';
  
  const deviceName = result.device.model || 
    `${result.os.name} ${result.browser.name}` || 
    'Unknown Device';
  
  return {
    deviceName,
    browser: `${result.browser.name} ${result.browser.version}` || 'Unknown Browser',
    os: `${result.os.name} ${result.os.version}` || 'Unknown OS',
    deviceType: result.device.type || 'desktop',
    location,
    ipAddress
  };
};


/*  todo jobs ; > 
  - handle for mising datas more acurately */ 