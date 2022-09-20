import { MercadoPago } from "mercadopago/interface";
import { WebSocket } from "ws";
import { WsResponse } from "../../../src/presentation/controllers/response-controller";

export const refundPayment = (ws: WebSocket, mp: MercadoPago, id: number) => {
    if (typeof id != "number") {
        return WsResponse.sendError(
            ws,
            "Erro: Parâmetro passado ao refund não é do tipo number, e sim do tipo "+typeof id
        )
    }
    mp.payment.refund(id)
    .then( update => {
        WsResponse.send(ws, "Estorno realizado com sucesso!", {
            id: update.body.id,
            amount: update.body.transaction_amount,
            status: update.status
        })
    })
    .catch( e => {
        WsResponse.sendError(ws, e.message)
    })
}