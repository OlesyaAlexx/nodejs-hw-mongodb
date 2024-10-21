import path from 'node:path';

export const sortOrderList = ['asc', 'desc'];

export const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 minutes

export const REFRESH_TOKEN_LIFETIME = 7 * 24 * 3600 * 1000; // 7 days

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USERNAME: 'SMTP_USERNAME',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const JWT_SECRET = 'JWT_SECRET';

export const DOMAIN = {
  FRONTEND_DOMAIN: 'FRONTEND_DOMAIN',
  BACKEND_DOMAIN: 'BACKEND_DOMAIN',
};

export const GOOGLE_VARS = {
  GOOGLE_AUTH_CLIENT_ID: 'GOOGLE_AUTH_CLIENT_ID',
  GOOGLE_AUTH_CLIENT_SECRET: 'GOOGLE_AUTH_CLIENT_SECRET',
  GOOGLE_AUTH_REDIRECT_URI: 'GOOGLE_AUTH_REDIRECT_URI',
};

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
