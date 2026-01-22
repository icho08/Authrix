export interface CreateApplicationParams {
  name: string;
  userId: string;
}

export interface UpdateApplicationParams {
  name: string;
  requireEmailVerification: boolean;
}

export interface UpdateApplicationSettingsParams {
  appId: string;
  userId: string;
  settings: {
    name?: string;
    requireEmailVerification?: boolean;
  };
}

export interface DeleteApplicationParams {
  appId: string;
  userId: string;
}

export interface GetApplicationUsersParams {
  userId: string;
  appId: string;
}

export interface ApplicationResponse {
  apiKey?: string;
  secretKey?: string;
  appId?: string;
  name?: string;
  requireEmailVerification?: boolean;
  error?: string;
}

export interface ApplicationUser {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
