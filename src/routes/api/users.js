import express from 'express';
import Users from '../../controllers/users';

const router = express.Router();

/* Users Routes Here */
router.post('/auth/signup', Users.signup);

export default router;
