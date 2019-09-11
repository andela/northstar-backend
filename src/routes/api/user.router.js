import express from 'express';
import UserController from '../../controllers/user.controller';
import auth from "../../middlewares/auth";
import UserMiddleware from '../../middlewares/user.middleware';
import roleValidation from '../../validation/user/role.validation';
import profileValidation from '../../validation/profile.validation';
import getValuesToUpdate from '../../middlewares/profile.middleware';

const { isSuperAdmin } = UserMiddleware;
const { setUserRole, updateProfile, getManagers } = UserController;
const router = express.Router();

router.patch('/role', auth.verifyUserToken, isSuperAdmin, roleValidation, setUserRole);
router.get('/managers', auth.verifyUserToken, getManagers);

router.patch('/profile', auth.verifyUserToken, profileValidation, getValuesToUpdate, updateProfile);

export default router;
