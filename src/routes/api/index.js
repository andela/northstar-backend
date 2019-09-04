import express from 'express';
import commentRouter from './comment.router';
import authRouter from './auth.router';
import requestRouter from './requests.router';
import facilitiesRouter from './facilities.router';


const router = express.Router();

router.use('/comment', commentRouter);
router.use('/auth', authRouter);
router.use('/', requestRouter);
router.use('/', facilitiesRouter);


export default router;
