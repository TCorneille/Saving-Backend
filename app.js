const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./Utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const userRouter = require('./Routes/userRoutes');

const app = express();

// ------------------- GLOBAL MIDDLEWARES -------------------

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit repeated requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Serve static files
app.use(express.static(`${__dirname}/public`));

// ------------------- ROUTES -------------------
app.use('/api/v1/users', userRouter);

// Catch unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// ------------------- GLOBAL ERROR HANDLING -------------------
app.use(globalErrorHandler);

module.exports = app;
