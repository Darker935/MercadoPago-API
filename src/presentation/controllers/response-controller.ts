import { WebSocket } from "ws";

export class WsResponse {
    public static send(ws: WebSocket, message: string, content?: any) {
        ws.send(JSON.stringify({
            status: 200,
            message: message,
            data: content
        }))
    }

    public static sendError(ws: WebSocket, message: string, content?: any ) {
        ws.send(JSON.stringify({
            status: 403,
            message: message,
            data: content
        }))
    }
}