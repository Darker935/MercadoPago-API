import WebSocket from "ws";

export const onError = (ws: WebSocket.WebSocket, error: Error) : void =>{
    console.log('onError: ',error.message)   
}