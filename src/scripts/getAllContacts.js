import { readContacts } from '../utils/readContacts.js';

export const getAllContacts = async () => {
  try {
    const contacts = await readContacts();
    return contacts;
  } catch (error) {
    console.log('Failed to read contacts from the file:', error);
  }
};

(async () => {
  console.log(await getAllContacts());
})();
