import express from 'express';

import passport from 'passport';

import UserController from '../../controllers/user.controller';
import UserMiddleware from '../../middlewares/user.middleware';
import socialMockMiddleWare from '../../middlewares/social-mock.middleware';
import signupValidator from '../../validation/user.validation';

const router = express.Router();

const authBase = '/auth';

/* Users Routes Here */
router.post(`${authBase}/signup`, signupValidator, UserController.signup);
router.post('/auth/signin', ...UserMiddleware.validateSigninFields(),
  UserController.signin);

/* google */
router.get(`${authBase}/google`, passport.authenticate('google', {
  scope: ['profile', 'email']
}));
router.get(`${authBase}/google/redirect`, passport.authenticate('google'), UserController.oauthSignin);

/* facebook */
router.get(`${authBase}/facebook`, passport.authenticate('facebook', {
  scope: ['email']
}));
router.get(`${authBase}/facebook/redirect`, passport.authenticate('facebook'), UserController.oauthSignin);


/* oauth mock routes */
router.post(`${authBase}/google`, socialMockMiddleWare, UserController.oauthSignin);
router.post(`${authBase}/facebook`, socialMockMiddleWare, UserController.oauthSignin);


export default router;
