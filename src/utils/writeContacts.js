import fs from 'node:fs/promises';

import { PATH_DB } from '../constants/contacts.js';

export const writeContacts = async (updatedContacts) => {
  try {
    const dataDb = JSON.stringify(updatedContacts, null, 2);
    await fs.writeFile(PATH_DB, dataDb, 'utf8');
  } catch (error) {
    console.error('Error writing to file:', error);
    throw error;
  }
};
