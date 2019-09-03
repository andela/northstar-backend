import AuthRouter from './api/auth.router';
import RequestsRoutes from './api/requests.router';
import CommentRoutes from './api/comment.router';
import UserRouter from './api/user.router';

const router = [RequestsRoutes, AuthRouter, UserRouter, CommentRoutes];

export default router;
