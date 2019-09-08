import express from 'express';
import UserController from '../../controllers/user.controller';
import verifyToken from '../../middlewares/jwtAuth';
import UserMiddleware from '../../middlewares/user.middleware';
import roleValidation from '../../validation/user/role.validation';

const { isSuperAdmin } = UserMiddleware;
const { setUserRole, getManagers } = UserController;
const router = express.Router();

router.patch('/role', verifyToken, isSuperAdmin, roleValidation, setUserRole);
router.get('/managers', verifyToken, getManagers);

export default router;
