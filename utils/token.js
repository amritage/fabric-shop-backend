const jwt = require('jsonwebtoken');
const { secret } = require('../config/secret');

exports.generateToken = (userInfo, expiresIn = '2d') => {
  const payload = {
    _id: userInfo._id,
    name: userInfo.name,
    email: userInfo.email,
    role: userInfo.role,
  };

  const token = jwt.sign(payload, secret.token_secret, {
    expiresIn,
  });

  return token;
};

// tokenForVerify
exports.tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    secret.jwt_secret_for_verify,
    { expiresIn: '10m' },
  );
};
