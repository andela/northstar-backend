import express from 'express';
import CommentController from '../../controllers/comment.controller';
import Token from '../../middlewares/auth';
import verifyToken from '../../middlewares/jwtAuth';
import Authorization from '../../middlewares/comment.middleware';
import validateComment from '../../validation/comment.validation';


const router = express.Router();

/* comment Routes Here */
router.post('/comments', verifyToken, validateComment, Authorization.ensureUserCanPost, CommentController.postComment);
router.delete('/comment/:comment_id', Token.verifyUserToken, Authorization.verifyCommentOwner, CommentController.deleteComment);
router.get('/comment/:request_id', Token.verifyUserToken, Authorization.verifyPermission, CommentController.getComments);

export default router;
