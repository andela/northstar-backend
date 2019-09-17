import express from 'express';

import NotificationController from '../../controllers/notification.controller';
import Auth from '../../middlewares/auth.middleware';

const router = express.Router();

/* Notification Routes Here */
router.get('/notifications', Auth.verifyToken, NotificationController.getNotifications);

export default router;
