import { bodyParser, cors, contentType, staticFiles } from '../middlewares'
import { Express } from 'express';
import requestip from 'request-ip'
import morgan from 'morgan';
import helmet from 'helmet';

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
  app.use(helmet())
  app.use(morgan('dev'))
  app.use('/public', staticFiles)
}
