import { IncomingMessage } from "http"
import WebSocket from "ws"
import { mp } from "../../../plugins/mercadopago/payments"
import PaymentsQueue from "../../../plugins/mercadopago/tasks/payments-queue"
import { WsResponse } from "../../presentation/controllers/response-controller"
import { onMessage, onError } from "../handlers"

export const onConnection = (ws: WebSocket.WebSocket, req: IncomingMessage) : void =>{
    ws.on('message', data => onMessage(ws, data))
    ws.on('error', error => onError(ws, error))
    PaymentsQueue.startTimeout(ws)
    WsResponse.send(ws, "Conectado com sucesso! Agora poderás receber as atuaalizações sobre status de pagamento do MercadoPago API")
}