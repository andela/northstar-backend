/* eslint-disable prefer-destructuring */
import jwt from 'jsonwebtoken';

const auth = {
  generateToken(user) {
    return jwt.sign({
      id: user.id,
      role: user.role,
    }, process.env.SECRET, { expiresIn: '7d' });
  },

  verifyToken(token) {
    let decoded = {};
    try {
      decoded.payload = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      decoded = { error: error.message };
    }
    return decoded;
  },

  async verifyUserToken(req, res, next) {
    try {
      let token;

      if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.headers['x-access-token']) {
        token = req.headers['x-access-token'];
      } else if (req.headers.token) {
        token = req.headers.token;
      }

      const decoded = auth.verifyToken(token);

      if (!token) {
        return res.status(401).json({
          status: 'error',
          error: 'No token provided.',
        });
      }

      if (decoded.error) {
        return res.status(401).json({
          status: 'error',
          error: 'Failed to authenticate token.',
        });
      }
      return next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Internal Server Error',
      });
    }
  }
};

export default auth;
