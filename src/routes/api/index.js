import express from 'express';
import commentRouter from './comment.router';
import authRouter from './auth.router';
import requestRouter from './requests.router';

const router = express.Router();

router.use('/comment', commentRouter);
router.use('/auth', authRouter);
router.use('/', requestRouter);


export default router;
