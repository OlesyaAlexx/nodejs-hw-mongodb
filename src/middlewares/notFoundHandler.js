/* import { HttpError } from 'http-errors'; */
/* import createHttpError from 'http-errors'; */

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  });
};

export const notFoundContact = (req, res, next) => {
  res.status(404).json({ message: 'Contact not found' });
};
