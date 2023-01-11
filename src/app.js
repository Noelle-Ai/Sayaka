const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const router = require('./routes/router');

const app = express();

const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10000,
    message: 'Too many requests, please try it later',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(rateLimiter);
app.use('/api', router);

module.exports = app;
