import { Router } from 'express';
import {
  getContactByIdController,
  getContactsController,
} from '../controllers/controllerContacts.js';

const router = Router();
router.get('/', getContactsController);

router.get('/:contactId', getContactByIdController);

export default router;
