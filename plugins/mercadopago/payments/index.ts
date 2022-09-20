import WebSocket from "ws"
import { createPayment, verifyPayment, refundPayment } from "."

import mercadopago from 'mercadopago';
import env from "../../../src/main/config/env";

mercadopago.configurations.setAccessToken(env.MP_ACCESS_TOKEN)

type MPOptions = 'create' | 'verify' | 'refund'

export const mp = mercadopago;

export default (ws: WebSocket.WebSocket, data: any) => {
    let type = data.type;
    switch (type) {
        case 'create':
            createPayment(ws, mercadopago, data )
            break
        case 'refund':
            refundPayment(mercadopago)
            break
        case 'verify':
            verifyPayment(mercadopago, data.id)
            break
        default:
            ws.send(JSON.stringify({
                status: 403,
                message: "Necessario informar o tipo: 'type' is missing (create|verify|refund)"
            }))
            break
    }
}

export * from './create-payment';
export * from './verify-payment';
export * from './refund-payment';