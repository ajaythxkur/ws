import { WebSocketServer } from "ws";
import helper from "./helper.js"

function Socket(server){
    const TYPES = {
        "TEST": (v) => TEST(v)
    }
    function TEST(v){
        console.log(v)
    }


    const clients = new Map();
    const wss = new WebSocketServer({server});

    wss.on('connection', (ws) => {
        console.log("connected to websocket")
        const id = helper.uuidv4();
        const color = Math.floor(Math.random() * 360);
        const metadata = { id, color };
        clients.set(ws, metadata);
        ws.on('message', (messageAsString) => {
            console.log("receiving messages")
            const message = JSON.parse(messageAsString);
            TYPES[message.type](message);
        });
        ws.on("close", () => {
            clients.delete(ws);
          });
    });
}
export{
    Socket
} 