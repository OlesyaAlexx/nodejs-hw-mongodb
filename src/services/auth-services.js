import bcrypt from 'bcrypt';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';
import { hashValue } from '../utils/hash.js';
import createHttpError from 'http-errors';
import { env } from '../utils/env.js';
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import { JWT_SECRET } from '../constants/index.js';
import { DOMAIN } from '../constants/index.js';
import { sendMail } from '../utils/sendMail.js';
import { generateResetPasswordEmail } from '../utils/generateResetPasswordEmail.js';

export const findUser = (filter) => User.findOne(filter);

export const signup = async (data) => {
  const { password } = data;
  const hashPassword = await hashValue(password);
  return User.create({ ...data, password: hashPassword });
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  console.log('Sending reset password email to:', user.email);
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(JWT_SECRET),
    {
      expiresIn: 5 * 60, //5 minutes,
    },
  );

  const resetLink = `${env(
    DOMAIN.FRONTEND_DOMAIN,
  )}/auth/reset-password?token=${resetToken}`;

  try {
    await sendMail({
      to: email,
      from: env(SMTP.SMTP_FROM),
      html: generateResetPasswordEmail({
        name: user.name,
        resetLink: resetLink,
      }),
      subject: 'Reset your password!',
    });
  } catch (err) {
    console.log(err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let payload;
  try {
    payload = jwt.verify(token, env(JWT_SECRET));
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
  const user = await User.findById(payload.sub);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  // Перевірка чи новий пароль відрізняється від старого
  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) {
    throw createHttpError(
      400,
      'New password must be different from the old one.',
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(user._id, { password: hashedPassword });

  // Видалення сесій після зміни пароля
  await Session.deleteOne({ userId: user._id });
};
