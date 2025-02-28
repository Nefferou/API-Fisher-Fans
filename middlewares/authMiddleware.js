const jwt = require('jsonwebtoken');

const publicRoutes = [
    { method: 'POST', path: '/api/v1/auth/login' },
    { method: 'POST', path: '/api/v1/auth/register' }
];

exports.authenticate = (req, res, next) => {
    const isPublicRoute = publicRoutes.some(route => route.method === req.method && route.path === req.path);

    if (req.method === 'GET' || isPublicRoute) {
        return next();
    }

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token', error: err.message });
        }
        req.user = decoded;
        next();
    });
};
