import { MercadoPago } from "mercadopago/interface";
import { TransactionStatus } from "../tasks/payments-queue";

export const verifyPayment = async (mp: MercadoPago, id: number): Promise<TransactionStatus> => {
    let data = await mp.payment.findById(id)
    return data.body.status
}