import { OAuth2Client } from 'google-auth-library';
import path from 'node:path';

import fs from 'node:fs';
import { env } from './env.js';
import { GOOGLE_VARS } from '../constants/index.js';
import createHttpError from 'http-errors';

const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

const googleOauthParams = JSON.parse(fs.readFileSync(PATH_JSON).toString());

const oauthClient = new OAuth2Client({
  projectId: googleOauthParams.web.project_id,
  clientId: env(GOOGLE_VARS.GOOGLE_AUTH_CLIENT_ID),
  clientSecret: env(GOOGLE_VARS.GOOGLE_AUTH_CLIENT_SECRET),
  redirectUri: env(GOOGLE_VARS.GOOGLE_AUTH_REDIRECT_URI),
});

export const generateOAuthUrl = () => {
  return oauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
};

export const validateCode = async (code) => {
  try {
    const { tokens } = await oauthClient.getToken(code);
    const idToken = tokens.id_token;

    // Перевірка токена
     const ticket = oauthClient.verifyIdToken({ idToken });
   /*  const ticket = await Promise.resolve(
      oauthClient.verifyIdToken({ idToken }),
    ); */

    return ticket;
  } catch (err) {
    console.log(err);

    if (err.status === 400) {
      throw createHttpError(err.status, 'Token is invalid');
    }
    throw createHttpError(500, 'Something is wrong with Google Oauth!');
  }
};
