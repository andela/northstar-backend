import AuthRouter from './api/auth.router';
import RequestsRoutes from './api/requests.router';
import IndexRoutes from './api/index.router';
import CommentRoutes from './api/comment.router';

const router = [RequestsRoutes, AuthRouter, IndexRoutes, CommentRoutes];

export default router;
