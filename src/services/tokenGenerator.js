import jwt from 'jsonwebtoken';

const token = {
  generateToken(user) {
    return jwt.sign({
      id: user.id,
      role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }
};

export default token;
