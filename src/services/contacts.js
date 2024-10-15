import { ContactsCollection } from '../db/models/contacts.js';
import calcPaginationData from '../utils/calcPaginationData.js';
import { contactFieldList } from '../constants/contact-constants.js';
import { sortOrderList } from '../constants/index.js';

export const getAllContacts = async ({
  filter,
  page,
  perPage,
  sortBy = contactFieldList[0],
  sortOrder = sortOrderList[0],
}) => {
  const skip = (page - 1) * perPage;

  console.log('Filters:', filter); // Логування фільтрів

  const databaseQuery = ContactsCollection.find({ userId: filter.userId });

  if (filter.contactType) {
    databaseQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite !== undefined) {
    databaseQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const items = await databaseQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  // Запит для підрахунку загальної кількості контактів
  const totalItems = await ContactsCollection.countDocuments(
    databaseQuery.getQuery(),
  );

  const { totalPages, hasNextPage, hasPrevPage } = calcPaginationData({
    totalItems,
    perPage,
    page,
  });

  return {
    items,
    totalItems,
    page,
    perPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

export const postContacts = async (payload) => {
  const existingContact = await ContactsCollection.findOne({
    name: payload.name,
    phoneNumber: payload.phoneNumber,
    email: payload.email,
  });

  // Якщо контакт вже існує, повертаємо помилку
  if (existingContact) {
    throw new Error('Contact with this name and phone number already exists');
  }

  // Якщо контакт не існує, створюємо новий контакт
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const filter = { _id: contactId, userId };
  const update = payload;
  const opts = {
    new: true, // Повертає оновлений контакт
    runValidators: true, // Перевіряє валідність даних перед оновленням
    upsert: false,
    ...options,
  };

  const updatedContact = await ContactsCollection.findOneAndUpdate(
    filter,
    update,
    opts,
  );

  if (!updatedContact) {
    console.warn('No contact found or update failed:', filter);
    return null;
  }

  return updatedContact; // Повертаємо оновлений контакт
};

export const deleteContact = async (contactId, userId) => {
  const result = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  if (!result) {
    console.warn('No contact found for deletion:', { contactId, userId });
    return null; // Повертаємо null, якщо контакт не знайдено
  }

  return result; // Повертаємо видалений контакт
};
