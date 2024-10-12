import { TEMP_PATH, UPLOAD_PATH } from './constants/path.js';
import { initMongoCollection } from './db/initMongoCollection.js';
import { startServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';

const bootstrap = async () => {
  await initMongoCollection();
  await createDirIfNotExists(TEMP_PATH);
  await createDirIfNotExists(UPLOAD_PATH);
  startServer();
};

bootstrap();
