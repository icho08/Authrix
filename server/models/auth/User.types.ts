export interface CreateUserParams { 
  email: string;
  password: string;
  username: string;
  applicationId: string;
  isVerified: boolean;
  userAgent?: string;
  ipAddress?: string;
}

export interface LoginUserParams { 
  email: string;
  password: string;
  applicationId: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface ChangeUserPasswordParams { 
  oldPassword: string;
  newPassword: string;
  userId: string;
  applicationId: string;
}

export interface ResetUserPasswordParams { 
  token: string;
  newPassword: string;
  applicationId: string;
}

