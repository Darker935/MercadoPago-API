import { MercadoPago } from "mercadopago/interface";
import moment from 'moment'
import { CreatePaymentPayload } from "mercadopago/models/payment/create-payload.model";
import { WebSocket } from "ws";
import { inspect } from 'util'
import { SqliteHelper } from "../../../src/infra/db/helpers/sqlite/sqlite-helper";
import PaymentsQueue from "../tasks/payments-queue";
import { WsResponse } from "../../../src/presentation/controllers/response-controller";

export const createPayment = (ws: WebSocket, mp: MercadoPago, data: any) => {
    if (!data.email)
        return WsResponse.sendError(ws, "Necessario informar um email")
    // if (!data.number)
    //     return ws.send(errorMsg("Informe um CPF/Numero"))

    let date = moment(Date.now() + (2 * 60 * 60 * 1000)).format("yyyy-MM-DDTHH:mm:ss") + ".000Z"

    var payment_data: CreatePaymentPayload = {
        transaction_amount: 1,
        description: 'Pagamento Teste',
        payment_method_id: 'pix',
        installments: 1,
        date_of_expiration: date,
        payer: {
            phone: data.phone,
            email: data.email,
        },
    };

    mp.payment.create(payment_data).then(function (data2) {
        let body = data2.body;
        SqliteHelper.insert(
            "payments",
            [
                'id', 'status', 'currency_id', 'email',
                'description', 'live_mode', 'amount',
                'qrcode', 'qrcode_base64', 'ticket_url'
            ],
            [
                body.id, body.status, body.currency_id,
                data.email, body.description, body.live_mode,
                body.transaction_amount,
                body.point_of_interaction.transaction_data.qr_code,
                body.point_of_interaction.transaction_data.qr_code_base64,
                body.point_of_interaction.transaction_data.ticket_url
            ]
        )
        PaymentsQueue.startTimeout(ws)
        WsResponse.send(ws, "Criado com sucesso", {
            email: data.email,
            copia_e_cola: body.point_of_interaction.transaction_data.qr_code,
            qr_code_base64: body.point_of_interaction.transaction_data.qr_code_base64
        })
    }).catch(function (error) {
        console.log(error.message)
        WsResponse.sendError(ws, "Falhou")
    });
}