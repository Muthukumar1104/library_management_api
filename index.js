const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// Path API version
const api = '/api/v1';

// Path CRM Modules
const crm = 'crm';

// eslint-disable-next-line no-undef
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 60000 });

const { morganMiddleware } = require('./src/infrastructures/middlewares/morgan.middleware');
const logger = require('./src/infrastructures/utils/logger');

// Controllers
const authController = require('./src/auth/auth.controller');
const bookController = require('./src/crm/book/books.controller');
const memberController = require('./src/crm/Member/member.controller');

const ErrorHandler = require('./src/infrastructures/middlewares/errorHandler');
const headers = require('./src/infrastructures/middlewares/headers');

// eslint-disable-next-line no-undef
const PORT = 3000;

app.use(
  cors({
    origins: ['http://localhost:4000'], // Change this to the origin of your frontend application
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
  }),
);

app.use(bodyParser.json());
app.use(headers);
app.use(morganMiddleware);

app.get('/', (req, res) => {
  res.json('Success');
});

app.use(`${api}/auth`, authController);
app.use(`${api}/${crm}/book`, bookController);
app.use(`${api}/${crm}/member`, memberController);

app.use(ErrorHandler);

app.listen(PORT, () => {
  logger.log(`Server is listening on port ${PORT}`);
});
