import WebSocket from "ws";
import paymentHandler from "../../../plugins/mercadopago/payments"
import { Broadcast } from "./broadcast";

function parse(str: string) {
    try { return JSON.parse(str) }
    catch (error) { return undefined }
}

export const onMessage = (ws: WebSocket.WebSocket, data: WebSocket.RawData) : void =>{
    console.log('onMessage: '+ data.toString())
    let wsData = parse(data.toString());
    if (!wsData) ws.send(JSON.stringify({
        status: 403,
        message: "Informe um JSON valido"
    }))
    paymentHandler(ws, wsData)
}

