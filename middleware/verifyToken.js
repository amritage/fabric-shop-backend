const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { secret } = require('../config/secret');
/**
 * 1. check if token exists
 * 2. if not token send res
 * 3. decode the token
 * 4. if valid next
 */

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        error: 'You are not logged in',
      });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        error: 'You are not logged in',
      });
    }
    const decoded = await promisify(jwt.verify)(token, secret.token_secret);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
