import createHttpError from 'http-errors';

import { findSession } from '../services/session-services.js';
import { findUser } from '../services/auth-services.js';

const authenticate = async (req, res, next) => {
  console.log('Incoming request:', req.method, req.url); // Логування запиту

  const authHeader = req.get('Authorization');
  if (!authHeader) {
    console.error('Authorization header missing'); // Логування
    return next(createHttpError(401, 'Authorization header missing'));
  }

  const [bearer, accessToken] = authHeader.split(' ');
  console.log('Bearer:', bearer, 'AccessToken:', accessToken); // Логування токена

  if (bearer !== 'Bearer') {
    console.error('Token must have Bearer type'); // Логування
    return next(createHttpError(401, 'Token must have Bearer type'));
  }

  if (!accessToken) {
    console.error('Token missing'); // Логування
    return next(createHttpError(401, 'Token missing'));
  }

  const session = await findSession({ accessToken });

  if (!session) {
    console.error('Session not found'); // Логування
    return next(createHttpError(401, 'Session not found'));
  }

  const accessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (accessTokenExpired) {
    console.error('Access token expired'); // Логування
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await findUser({ _id: session.userId });
  if (!user) {
    console.error('User not found'); // Логування
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  next();
};
export default authenticate;
