const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./Utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const accountRouter = require('./Routes/accountRoutes');
const adminRouter = require('./Routes/adminRoutes');
const userRouter = require('./Routes/userRoutes');

const app = express();

// ------------------- GLOBAL MIDDLEWARES -------------------

// ✅ Enable CORS before any routes
app.use(
  cors({
    origin: [
      'http://localhost:5173', // Local development frontend
      'https://saving-frontend.onrender.com', // Deployed frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ❌ Do NOT use app.options('*', cors()); — not compatible with Express 5

// ✅ Set security HTTP headers
app.use(helmet());

// ✅ Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Limit repeated requests from same IP
const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per hour
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// ✅ Parse JSON bodies
app.use(express.json({ limit: '10kb' }));

// ✅ Parse cookies
app.use(cookieParser());

// ✅ Data sanitization against NoSQL injection
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach((key) => {
      const value = req.query[key];
      if (typeof value === 'object') mongoSanitize.sanitize(value);
    });
  }
  next();
});

// ✅ Prevent parameter pollution
app.use(hpp());

// ✅ Serve static files
app.use(express.static(`${__dirname}/public`));

// ------------------- ROUTES -------------------
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/account', accountRouter);
app.use('/api/v1/users', userRouter);

// ------------------- HANDLE UNKNOWN ROUTES -------------------
// (Express 5 compatible)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ------------------- GLOBAL ERROR HANDLER -------------------
app.use(globalErrorHandler);

module.exports = app;



