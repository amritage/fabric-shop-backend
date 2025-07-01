const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { secret } = require('../config/secret');

/**
 * 1. check if token exists
 * 2. if token exists, decode it and attach user to request
 * 3. if token is invalid or doesn't exist, proceed without user
 * 4. always call next()
 */

module.exports = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(' ')?.[1];

    if (token) {
      const decoded = await promisify(jwt.verify)(token, secret.token_secret);
      req.user = decoded; // Attach user if token is valid
    }
  } catch (error) {
    // If token is invalid, just ignore it and proceed
    // The request will be unauthenticated
  }

  next();
};
