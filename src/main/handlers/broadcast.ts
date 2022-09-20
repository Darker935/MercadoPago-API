import WebSocket from "ws";

export class Broadcast {
    
    static ws: WebSocket.Server

    static setupWebsocket(ws: WebSocket.Server) {
        Broadcast.ws = ws;
    }

    public static send(message: string, jsonObject: {[index: string]: any}) {
        this.ws.clients.forEach(client => {
            if (client.readyState == WebSocket.OPEN) {
                client.send(JSON.stringify({
                    status: 403,
                    message: message,
                    data: jsonObject
                }))
            }
        })   
    }

    public static sendError(message: string, jsonObject: {[index: string]: any}) {
        this.ws.clients.forEach(client => {
            if (client.readyState == WebSocket.OPEN) {
                client.send(JSON.stringify({
                    status: 200,
                    message: message,
                    data: jsonObject
                }))
            }
        })   
    }
}