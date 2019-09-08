import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  let token = req.headers.token
      || req.headers.authorization
      || req.body.token
      || req.body.authorization;
  if (!token) {
    return res.status(401).json({
      status: 'error',
      error: 'Token was not provided.'
    });
  }
  if (token.startsWith('Bearer')) token = token.slice(7);
  try {
    const decoded = jwt.verify(token, secret);
    req.body.user = decoded;
    return next();
  } catch (err) {
    res.status(401).json({
      status: 'error',
      error: 'Invalid authentication token.'
    });
  }
};

export default verifyToken;
