import express from 'express';

import UserController from '../../controllers/user.controller';
import UserMiddleware from '../../middlewares/user.middleware';

const router = express.Router();

/* Users Routes Here */
router.post('/signup', UserController.signup);
router.post('/signin', ...UserMiddleware.validateSigninFields(), UserController.signin);

export default router;
