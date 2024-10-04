import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';

import {
  userSignupSchema,
  userSigninSchema,
} from '../validation/user-schemas.js';
import {
  signupController,
  signinController,
} from '../controllers/controllerAuth.js';

const authRouter = Router();
authRouter.post(
  ' / singup',
  validateBody(userSignupSchema),
  ctrlWrapper(signupController),
);
authRouter.post(
  '/singin',
  validateBody(userSigninSchema),
  ctrlWrapper(signinController),
);

export default authRouter;
