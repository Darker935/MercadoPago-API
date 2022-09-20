import express, { Express } from 'express'
import { Server } from 'http'
import env from './env'
import setUpMidllewares from './middlewares'
import setupRoutes from './routes'

function setupPort(app: Express): Server {
  return app.listen(env.PORT, () => {
    console.log('App listening on port ' + env.PORT)
  })
}

export const setupApp = async (): Promise<Server> => {
  const app = express()
  setUpMidllewares(app)
  setupRoutes(app)
  return setupPort(app)
}
