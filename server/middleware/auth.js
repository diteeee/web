require('dotenv').config();
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const JWT_SECRET_KEY = process.env.JWT_SECRET
const auth = async (req, res, next) => {
    try {
        logger.info(req.header('Authorization'))
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not set' })
        }
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                logger.info(err)
                return res.status(403).json({ message: 'Token not valid' })
            }
            logger.info(decoded)
            req.user = decoded;
            next();
        });
    } catch (error) {
        logger.error('Error authenticating user:', error);
        return res.status(401).json({ message: 'User Token Invalid' })
    }
};
module.exports = auth;