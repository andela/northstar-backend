import AuthRouter from './api/auth.router';
import RequestsRoutes from './api/requests.router';
import IndexRoutes from './api/index.router';
import MulticityRoutes from './api/multicityRequests';

const router = [RequestsRoutes, AuthRouter, IndexRoutes, MulticityRoutes];

export default router;
