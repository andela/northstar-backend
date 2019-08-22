import jwt from 'jsonwebtoken';

export default {
    verifyToken: (req, res, next) => {
        const { authorization } = req.headers;
        let token;

        if (typeof authorization !== 'undefined' && authorization.includes('Bearer')) {
            token = authorization.replace('Bearer ', '');
        } else {
            token = req.body.token;
        }

        if (typeof token === 'undefined') {
            return res.status(403).json({
                status: 'error',
                error: {
                    message: 'You must be logged in to proceed'
                },
            });
        }

        try {
            req.user = jwt.decode(token, process.env.JWT_SECRET);

            const {
                id, role
            } = req.user;

            /* pipe the token details into the request body */
            req.body.user_id = id;
            req.body.role = role;

            return next();
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                error: {
                    message: 'Authentication failed!',
                },
            });
        }
    },
};
