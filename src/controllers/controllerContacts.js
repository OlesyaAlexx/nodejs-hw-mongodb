import {
  getAllContacts,
  getContactById,
  postContacts,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import { contactFieldList } from '../constants/contact-constants.js';
import parseSortParams from '../utils/parseSortParams.js';
import parseContactFilterParams from '../utils/parseContactFilterParams.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { query } = req;
    const { page, perPage } = parsePaginationParams(query);
    const { sortBy, sortOrder } = parseSortParams(query, contactFieldList);
    const filter = parseContactFilterParams(query);

    // Додаємо userId до фільтра
    const userFilter = { ...filter, userId: req.user._id };

    const data = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter: userFilter, // Використовуємо новий фільтр з userId
    });
    res.json({
      status: 200,
      message: 'Sucessfully found contacts!',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const data = await getContactById(contactId);

  if (!data) {
    throw createHttpError(404, 'Contact not found'); // Використовуємо createHttpError
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

export const postContactsController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // Перевірка обов'язкових полів
    if (!name || !phoneNumber || !contactType) {
      throw createHttpError(
        400,
        'Missing required fields: name, phoneNumber, and contactType are required',
      );
    }
    const newContact = {
      name,
      phoneNumber,
      email,
      isFavourite: isFavourite || false,
      contactType,
      userId: req.user._id, // Додаємо userId з авторизованого користувача
    };
    // Виклик сервісу для створення контакту
    const data = await postContacts(newContact);

    // Відповідь з кодом 201 та даними створеного контакту
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    //Перевірка чи контакт існує
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Перевірка, чи належить контакт авторизованому користувачу
    if (contact.userId.toString() !== req.user._id.toString()) {
      throw createHttpError(
        403,
        'You do not have permission to update this contact',
      );
    }

    // Оновлюєм контакт
    const updatedContact = await updateContact({ _id: contactId }, req.body);

    res.json({
      status: 200,
      message: 'Successfully updated a contact!',
      data: updatedContact,
    });
  } catch (error) {
    console.error('Error in patchContactController:', error); // Логування помилок
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    // Знаходимо контакт по ID
    const contact = await getContactById(contactId);

    // Перевірка, чи існує контакт
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    // Перевірка, чи належить контакт авторизованому користувачу
    if (contact.userId.toString() !== req.user._id.toString()) {
      throw createHttpError(
        403,
        'You do not have permission to delete this contact',
      );
    }

    // Видаляємо контакт
    await deleteContact(contactId);

    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteContactController:', error); // Логування помилок
    next(error);
  }
};
