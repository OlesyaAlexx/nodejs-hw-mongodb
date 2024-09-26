import { ContactsCollection } from '../db/models/contacts.js';
import calcPagnationData from '../utils/calcPaginationData.js';
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

  const databaseQuery = ContactsCollection.find();
  if (filter.contactType) {
    databaseQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    databaseQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const items = await databaseQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const totalItems = await ContactsCollection.find()
    .merge(databaseQuery)
    .countDocuments();
  const { totalPages, hasNextPage, hasPrevPage } = calcPagnationData({
    total: totalItems,
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

export const getContactById = async (contactId) => {
  return await ContactsCollection.findById(contactId);
};

export const postContacts = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (filter, payload, options = {}) => {
  const result = await ContactsCollection.findOneAndUpdate(filter, payload, {
    new: true, // Повертає оновлений документ
    runValidators: true, // Перевіряє валідність даних перед оновленням
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) {
    console.warn('No contact found or update failed:', filter);
    return null; // Не знайшли контакт або оновлення не пройшло
  }

  const isNew = result.lastErrorObject?.updatedExisting === false; // Перевірка на новий запис

  return {
    payload: result.value,
    isNew,
  };
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
