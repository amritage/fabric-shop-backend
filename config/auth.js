require('dotenv').config();
const jwt = require('jsonwebtoken');
const Admin = require('../model/Admin');
const { secret } = require('./secret');
const { tokenForVerify } = require('../utils/token');

const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
    },
    secret.token_secret,
    {
      expiresIn: '2d',
    },
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, secret.token_secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

const isAdmin = async (req, res, next) => {
  const admin = await Admin.findOne({ role: 'Admin' });
  if (admin) {
    next();
  } else {
    res.status(401).send({
      message: 'User is not Admin',
    });
  }
};

module.exports = {
  signInToken,
  tokenForVerify,
  isAuth,
  isAdmin,
};
