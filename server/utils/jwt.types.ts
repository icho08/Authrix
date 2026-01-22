export interface JWTPayload {
  userId: string;
  email: string;
  applicationId: string;
  isVerified: boolean;
}

export interface RefreshTokenParams {
  userId: string;
  applicationId: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface DeviceInfo {
  deviceName?: string;
  browser?: string;
  os?: string;
  deviceType?: string;
  location?: string;
  ipAddress?: string;
}
