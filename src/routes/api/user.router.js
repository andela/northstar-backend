import express from 'express';
import UserController from '../../controllers/user.controller';
import verifyToken from '../../middlewares/jwtAuth';
import UserMiddleware from '../../middlewares/user.middleware';
import roleValidation from '../../validation/user/role.validation';
import profileValidation from '../../validation/profile.validation';
import getValuesToUpdate from '../../middlewares/profile.middleware';

const { isSuperAdmin } = UserMiddleware;
const { setUserRole, updateProfile, getManagers } = UserController;
const router = express.Router();

router.patch('/role', verifyToken, isSuperAdmin, roleValidation, setUserRole);
router.get('/managers', verifyToken, getManagers);

router.patch('/profile', verifyToken, profileValidation, getValuesToUpdate, updateProfile);

export default router;
