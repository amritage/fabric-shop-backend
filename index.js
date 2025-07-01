require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const hpp = require('hpp');

const connectDB = require('./config/db');
const globalErrorHandler = require('./middleware/global-error-handler');
const { secret } = require('./config/secret');

const app = express();
const PORT = process.env.PORT || 7000;
const BASE_URL = process.env.BASE_URL || 'http://localhost:7000';

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/public/images',
  express.static(path.join(__dirname, 'public/images')),
);

// Serve uploaded images and videos from separate folders
app.use(
  '/uploadimage',
  express.static(
    path.join(__dirname, process.env.UPLOAD_IMAGE_PATH || 'uploadimage'),
  ),
);
app.use(
  '/uploadvideo',
  express.static(
    path.join(__dirname, process.env.UPLOAD_VIDEO_PATH || 'uploadvideo'),
  ),
);

// Routes
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/category', require('./routes/category.routes'));
app.use('/api/brand', require('./routes/brand.routes'));
app.use('/api/product', require('./routes/product.routes'));
app.use('/api/order', require('./routes/order.routes'));
app.use('/api/user-order', require('./routes/user.order.routes'));
app.use('/api/coupon', require('./routes/coupon.routes'));
app.use('/api/review', require('./routes/review.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/cloudinary', require('./routes/cloudinary.routes'));

// New Routes
app.use('/api/content', require('./routes/content.routes'));
app.use('/api/structure', require('./routes/structure.routes'));
app.use('/api/finish', require('./routes/finish.routes'));
app.use('/api/design', require('./routes/design.routes'));
app.use('/api/motifsize', require('./routes/motifsize.routes'));
app.use('/api/suitablefor', require('./routes/suitablefor.routes'));
app.use('/api/vendor', require('./routes/vendor.routes'));
app.use('/api/color', require('./routes/color.routes'));
app.use('/api/newcategory', require('./routes/newcategory.routes'));
app.use('/api/uniquecode', require('./routes/uniquecode.routes'));
app.use('/api/substructure', require('./routes/substructure.routes'));
app.use('/api/subfinish', require('./routes/subfinish.routes'));
app.use('/api/subsuitable', require('./routes/subsuitable.routes'));
app.use('/api/newproduct', require('./routes/newproduct.routes'));
app.use('/api/groupcode', require('./routes/groupcode.routes'));

// Root route
app.get('/', (req, res) => {
  res.send('Apps worked successfully');
});

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
});

// Global error handler
app.use(globalErrorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${BASE_URL}`);
  });
}

module.exports = app;
