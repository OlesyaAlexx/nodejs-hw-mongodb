import path from 'node:path';

export const TEMPLATES_PATH = path.join(process.cwd(), 'src', 'templates');
export const TEMP_PATH = path.join(process.cwd(), 'src', 'temp');
export const UPLOAD_PATH = path.join(process.cwd(), 'src', 'upload');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};
