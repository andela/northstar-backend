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
            let token;

            if (req.headers.authorization) {
                token = req.headers.authorization;
            } else if (req.headers['x-access-token']) {
                token = req.headers['x-access-token'];
            } else if (req.headers.token) {
                token = req.headers.token;
            }

            const decoded = auth.verifyToken(token);
            if (!token) {
                return res.status(401).json({
                    status: 'error',
                    error: 'No token provided!',
                });
            }

            if (decoded.error) {
                return res.status(401).json({
                    status: 'error',
                    error: 'Failed to authenticate token.',
                });
            }

            req.currentUser = await User.findOne({where: {id: decoded.payload.id}});
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
            let token;

            if (req.headers.authorization) {
                token = req.headers.authorization;
            } else if (req.headers['x-access-token']) {
                token = req.headers['x-access-token'];
            } else if (req.headers.token) {
                token = req.headers.token;
            }
            const decoded = auth.verifyToken(token);

            if (!((decoded.payload.role === 'super_admin') || (decoded.payload.role === 'manager'))) {
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
