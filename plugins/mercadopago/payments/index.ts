import WebSocket from "ws"
import { createPayment, verifyPayment, refundPayment } from "."

import mercadopago from 'mercadopago';
import env from "../../../src/main/config/env";
import { WsResponse } from "../../../src/presentation/controllers/response-controller";

mercadopago.configurations.setAccessToken(env.MP_ACCESS_TOKEN as string)

type MPOptions = 'create' | 'verify' | 'refund'

export const mp = mercadopago;

export default (ws: WebSocket.WebSocket, data: any) => {
    let type = data.type;
    switch (type) {
        case 'create':
            createPayment(ws, mercadopago, data )
            break
        case 'refund':
            refundPayment(ws, mercadopago, data.id)
            break
        case 'verify':
            verifyPayment(mercadopago, data.id)
            break
        default:
            WsResponse.sendError(ws, "Necessario informar o tipo: 'type' is missing (create|verify|refund)")
            break
    }
}

export * from './create-payment';
export * from './verify-payment';
export * from './refund-payment';