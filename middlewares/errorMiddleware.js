const AppError = require('../utils/AppError');

exports.errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Erreur interne du serveur' });
};

