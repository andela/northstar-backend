import express from 'express';
import Notification from '../../controllers/notification.controller';
import auth from '../../middlewares/auth';


const router = express.Router();


router.get('/mark-read', auth.verifyUserToken, Notification.markAsRead);

export default router;
