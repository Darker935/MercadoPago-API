import WebSocket from "ws"
import { onConnection } from '../handlers'

export default (appWs: WebSocket.Server) => {
    appWs.on('connection', onConnection)
}