const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    // Check if token is not provided
    if (!token) return res.sendStatus(401).json({ message: 'Token not found' });

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) return res.sendStatus(401);
        next();
    });
};
