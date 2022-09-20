import WebSocket from "ws";
import { WsResponse } from "../../presentation/controllers/response-controller";

export const onError = (ws: WebSocket.WebSocket, error: Error) : void =>{
    console.log('onError: ',error.message)
    WsResponse.sendError(ws, error.message)  
}