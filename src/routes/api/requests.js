import RequestController from '../../controllers/requests';

const router = express.Router();

const { createMultiCityRequest } = RequestController

// Request routes
const requestBaseUrl = '/api/v1/request';
router.post(`${requestBaseUrl}/multiCityRequests`, createMultiCityRequest);

export default router;