import express from 'express';
import CommentController from '../../controllers/comment.controller';
import auth from "../../middlewares/auth";
import Authorization from '../../middlewares/comment.middleware';
import validateComment from '../../validation/comment.validation';

const router = express.Router();

/* comment Routes Here */
router.post('/comments', auth.verifyUserToken, validateComment, Authorization.ensureUserCanPost, CommentController.postComment);
router.delete('/comment/:comment_id', auth.verifyUserToken, Authorization.verifyCommentOwner, CommentController.deleteComment);
router.get('/comment/:request_id', auth.verifyUserToken, Authorization.verifyPermission, CommentController.getComments);

export default router;
