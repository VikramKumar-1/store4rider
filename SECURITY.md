# Security Guidelines

## Authentication & Token Security
- No LocalStorage: NEVER store JWTs in localStorage or sessionStorage.
- Strict Cookies: Access and Refresh tokens must use HttpOnly, Secure, SameSite=Strict cookies.
- Token Invalidation: Logout must immediately blacklist the refresh token in Redis.

## API & Network Security
- Strict Rate Limiting: IP-based rate limiting via Redis.
- Helmet.js / Security Headers.
- CORS: Strictly allow only the explicit frontend domain.

## Database & Input Security
- Strict Zod Validation: EVERY API endpoint must validate against strict Zod schemas.
- NoSQL Injection Prevention: Sanitize all inputs.
