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

// ✅ Enable CORS globally (no wildcard paths)
app.use(
  cors({
    origin: [
      'http://localhost:5173', // Local frontend

    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ✅ Handle preflight requests safely for all routes
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    return res.sendStatus(204);
  }
  next();
});

// ✅ Security headers
app.use(helmet());

// ✅ Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// ✅ Body parser
app.use(express.json({ limit: '10kb' }));

// ✅ Parse cookies
app.use(cookieParser());

// ✅ Data sanitization
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
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ------------------- GLOBAL ERROR HANDLER -------------------
app.use(globalErrorHandler);

module.exports = app;
