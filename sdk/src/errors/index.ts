export class AuthSDKError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthSDKError';
  }
}

export class ValidationError extends AuthSDKError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AuthSDKError {
  constructor(message: string, public status?: number) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends AuthSDKError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}
