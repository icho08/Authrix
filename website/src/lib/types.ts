export type User = {
  id: string;
  email: string;
  username?: string;
  isVerified: boolean;
  applicationId?: string;
};

export type AuthResponse = {
  user: {
    id: string;
    email: string;
    isVerified: boolean;
    applicationId: string;
  };
  accessToken: string;
  refreshToken: string;
};

export type Session = {
  id: string;
  deviceName?: string | null;
  browser?: string | null;
  os?: string | null;
  deviceType?: string | null;
  location?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  lastUsedAt: string;
};
