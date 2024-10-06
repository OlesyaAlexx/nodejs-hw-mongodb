import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';

import {
  userSignupSchema,
  userSigninSchema,
} from '../validation/user-schemas.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../controllers/controllerAuth.js';

const authRouter = Router();
authRouter.post(
  '/register',
  validateBody(userSignupSchema),
  ctrlWrapper(registerController),
);
authRouter.post(
  '/login',
  validateBody(userSigninSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));

export default authRouter;
