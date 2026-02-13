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
    allowedDomains?: string[];
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
  allowedDomains?: string[];
  error?: string;
}

export interface ManageDomainsParams {
  appId: string;
  userId: string;
  domain: string;
}
export interface ApplicationUser {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetActiveSessionsParams {
  appId: string;
  userId: string;
}

export interface ToggleAppRegistrationParams {
  appId: string;
  userId: string;
  allowed : boolean;
}