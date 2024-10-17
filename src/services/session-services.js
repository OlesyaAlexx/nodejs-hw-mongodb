import { randomBytes } from 'node:crypto';

import Session from '../db/models/session.js';
import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from '../constants/index.js';

export const findSession = (filter) => Session.findOne(filter);

export const createSession = async (userId) => {
  await Session.deleteOne({ userId });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  // Повертаємо сесію, включаючи токени
  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    sessionId: session._id.toString(),
  };
};

export const deleteSession = (filter) => Session.deleteOne(filter);
