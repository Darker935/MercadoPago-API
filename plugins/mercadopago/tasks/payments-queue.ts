import { MercadoPago } from "mercadopago/interface";
import { WebSocket } from "ws"
import { SqliteHelper } from "../../../src/infra/db/helpers/sqlite/sqlite-helper"
import { Broadcast } from "../../../src/main/handlers";
import { mp, verifyPayment } from "../payments";

var seconds = 30 * 1000;

export type TransactionStatus = 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back'

export default class PaymentsQueue {
    static timeout?: NodeJS.Timer
    static query_all: string = "SELECT id, status, email FROM payments WHERE status = 'pending'"

    static startTimeout(ws: WebSocket) {
        if (PaymentsQueue.timeout) clearInterval(PaymentsQueue.timeout)

        PaymentsQueue.timeout = setInterval(async()=>{
            let sql = await SqliteHelper.all(PaymentsQueue.query_all)
            console.log(sql)
            if (sql.length == 0) { 
                clearInterval(PaymentsQueue.timeout)
                PaymentsQueue.timeout = undefined;
            }
            sql.forEach(async transaction => {
                let status: TransactionStatus = transaction.status
                switch(status) {
                    case 'approved':
                    SqliteHelper.conn.exec('DELETE FROM payments WHERE id = '+transaction.id)
                        break
                    case 'cancelled':
                        break
                    case 'pending':
                        let status = await verifyPayment(mp, transaction.id)
                        if (status == 'approved') {
                            SqliteHelper.insert(
                                'payments',
                                ['id', 'status'],
                                [transaction.id, status]
                            )
                            Broadcast.broadcast({
                                status: 200,
                                message: "Pagamento realizado!",
                                data: {
                                    id: transaction.id,
                                    status: status,
                                    email: transaction.email
                                }
                            })
                        }
                        break
                    case 'authorized':
                        break
                }
            })
        }, seconds)
    }
}