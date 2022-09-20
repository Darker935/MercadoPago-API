import WebSocket from "ws";

export class Broadcast {
    
    static ws: WebSocket.Server

    static setupWebsocket(ws: WebSocket.Server) {
        Broadcast.ws = ws;
    }

    public static broadcast(jsonObject: {[index: string]: any}) {
        this.ws.clients.forEach(client => {
            if (client.readyState == WebSocket.OPEN) {
                client.send(JSON.stringify(jsonObject))
            }
        })   
    }
}