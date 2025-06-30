require('dotenv').config();
const mongoose = require('mongoose');
const { secret } = require('./secret');

// mongoose.set("strictQuery", false);

// local url
const DB_URL = process.env.MONGO_URI;
// mongodb url
// const MONGO_URI = secret.db_url;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('mongodb connection success!');
  } catch (err) {
    console.log('mongodb connection failed!', err.message);
  }
};

module.exports = connectDB;
