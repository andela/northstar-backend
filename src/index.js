import 'core-js/stable';
import 'regenerator-runtime/runtime';

import childProcess from 'child_process';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import logger from './logs/winston';
import swaggerDocument from '../swagger.json';
import v1Router from './routes';
import indexRouter from './routes/api/index.router';
import passportConfig from './validation/passport.config';
import stringSanitizer from './middlewares/sanitizer.middleware';

const oldSpawn = childProcess.exec;
const mySpawn = () => {
  logger.info('spawn called');
  logger.info(arguments);
  return oldSpawn.apply(this, arguments);
};
childProcess.exec = mySpawn;

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(':remote-addr - [:date] ":method :url" :status', { stream: logger.stream }));
app.use(passport.initialize());
passportConfig(passport);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(stringSanitizer);
app.use('/', indexRouter);
app.use('/api/v1', v1Router);

app.use((req, res, next) => {
  const err = new Error('No endpoint found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({
    status: 'error',
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
  next();
});

const port = parseInt(process.env.PORT, 10) || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}`));

export default app;
