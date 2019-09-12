import AuthRouter from './api/auth.router';
import RequestsRoutes from './api/requests.router';
import CommentRoutes from './api/comment.router';
import UserRouter from './api/user.router';
import BookingsRouter from './api/bookings.router';
import FacilitiesRouter from './api/facilities.router';
import RatingRouter from './api/rating.router';
import FeedbackRouter from './api/feedback.router';

const router = [
  RequestsRoutes,
  AuthRouter,
  UserRouter,
  CommentRoutes,
  FacilitiesRouter,
  RatingRouter,
  FeedbackRouter,
  BookingsRouter
];

export default router;
