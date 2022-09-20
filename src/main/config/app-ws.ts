import WebSocket from 'ws'
import { Server } from 'http';

import setupHandlers from './handlers'
import verifyClient from '../verifiers/websocket-login'
import { Broadcast } from '../handlers';
const { setupWebsocket } = Broadcast

export const setupAppWs = async (server: Server): Promise<WebSocket.Server> => {
  const appWs = new WebSocket.Server({ server, verifyClient })
  setupHandlers(appWs)
  setupWebsocket(appWs)
  return appWs
}
