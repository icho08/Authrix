# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [1.0.2] - 2025-12-16
 - Fixed issue with build script
## [1.0.1] - 2025-12-16

### Changed
- Updated homepage URL in package.json

## [1.0.0] - 2025-12-16

### Added
- Initial release of Authrix SDK
- Complete authentication flow (login, register, logout)
- React hooks for seamless integration (`useAuth`)
- Automatic token refresh with retry logic
- Built-in rate limiting and request retry
- Secure cookie-based token storage
- TypeScript support with full type definitions
- Password reset functionality with 6-digit codes
- Session management (logout all devices)
- Comprehensive error handling
- Configurable HTTP client with timeout and retries

### Features
- `AuthClient` class for direct API interaction
- `AuthProvider` component for React context
- `useAuth` hook for authentication state management
- Automatic token refresh on expiration
- Rate limiting (10 requests per minute by default)
- Request retry logic with exponential backoff
- Secure cookie management with proper expiration
- TypeScript interfaces for all data types

