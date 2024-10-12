import fs from 'node:fs/promises';
import path from 'node:path';
import { TEMP_PATH, UPLOAD_PATH } from '../constants/path.js';
import { env } from './env.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_PATH, file.filename),
    path.join(UPLOAD_PATH, file.filename),
  );

  return `${env('FRONTEND_DOMAIN')}/uploads/${file.filename}`;
};
