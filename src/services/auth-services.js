import bcrypt from 'bcrypt';
import User from '../db/models/user.js';
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
      expiresIn: 60 * 15, //15 minutes,
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
    throw createHttpError(500, 'Error in sending email');
  }
};

export const resetPassword = async ({ token, password }) => {
  let payload;
  try {
    payload = jwt.verify(token, env(JWT_SECRET));
  } catch (err) {
    throw createHttpError(401, err.message);
  }
  const user = await User.findById(payload.sub);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(user._id, { password: hashedPassword });
};
