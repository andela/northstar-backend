import jwt from 'jsonwebtoken';
import models from '../db/models';

const { User } = models;

const auth = {
  verifyToken(token) {
    let decoded = {};
    try {
      decoded.payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      decoded = { error: error.message };
    }
    return decoded;
  },

  async verifyUserToken(req, res, next) {
    try {
      let token =
        req.headers.token
        || req.body.token
        || req.headers.authorization
        || req.body.authorization
        || req.headers["x-access-token"];

      if (!token) {
        return res.status(401).json({
          status: 'error',
          error: 'No token provided!',
        });
      }
      
      if (token.startsWith("Bearer")) token = token.slice(7);
      const decoded = auth.verifyToken(token);

      if (decoded.error) {
        return res.status(401).json({
          status: "error",
          error: "Invalid authentication token."
        });
      }

      const user = await User.findOne({ where: { id: decoded.payload.id } });
      req.currentUser = user;
      const { payload } = decoded;
      req.body.user = user;
      req.tokenData = payload;
      return next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: ('Internal Server Error'),
      });
    }
  },

  async verifyManager(req, res, next) {
    try {
      if (!((req.currentUser.role === 'super_admin') || (req.currentUser.role === 'manager'))) {
        return res.status(401).json({
          status: 'error',
          error: 'Hi! You are not permitted to perform this action',
        });
      }
      return next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Error Accessing Route',
      });
    }
  },

  async verifyTravelAdmin(req, res, next) {
    try {
      if (!((req.currentUser.role === 'super_admin') || (req.currentUser.role === 'travel_admin'))) {
        return res.status(401).json({
          status: 'error',
          error: 'Hi! You are not permitted to perform this action',
        });
      }
      return next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Error Accessing Route',
      });
    }
  },
};

export default auth;
