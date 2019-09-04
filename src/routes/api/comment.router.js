import express from 'express';
import CommentController from '../../controllers/comment.controller';
import Token from '../../middlewares/auth';
import Authorization from '../../middlewares/comment.middleware';

const router = express.Router();

/* comment Routes Here */
router.delete('/comment/:comment_id', Token.verifyUserToken, Authorization.verifyCommentOwner, CommentController.deleteComment);
router.get('/comment/:request_id', Token.verifyUserToken, Authorization.verifyPermission, CommentController.getComments);

export default router;
