import { MercadoPago } from "mercadopago/interface";
import moment from 'moment'
import { CreatePaymentPayload } from "mercadopago/models/payment/create-payload.model";
import { WebSocket } from "ws";
import { inspect } from 'util'
import { SqliteHelper } from "../../../src/infra/db/helpers/sqlite/sqlite-helper";
import PaymentsQueue from "../tasks/payments-queue";

function errorMsg(str: string) {
    return JSON.stringify({
        status: 403,
        message: str
    })
}

export const createPayment = (ws: WebSocket, mp: MercadoPago, data: any) => {
    if (!data.email)
        return ws.send(errorMsg("Necessario informar um email"))
    // if (!data.number)
    //     return ws.send(errorMsg("Informe um CPF/Numero"))

    let date = moment(Date.now() + (2 * 60 * 60 * 1000)).format("yyyy-MM-DDTHH:mm:ss") + ".000Z"
    console.log(date)

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
        console.log(inspect(data2,false,5,true))
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
        ws.send(JSON.stringify({
            status: 200,
            message: "Criado com Sucesso",
            email: data.email,
            copia_e_cola: body.point_of_interaction.transaction_data.qr_code,
            qr_code_base64: body.point_of_interaction.transaction_data.qr_code_base64
        }))
    }).catch(function (error) {
        console.log(error.message)
        ws.send("Falhou: "+error.message)
    });
}