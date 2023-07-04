import express from "express";
const app = express();
app.use(express.json());
const port = 4000;
import http from "http";
import {Socket} from "./WebSocket.js";
const server = http.createServer(app);
Socket(server);
server.listen(port, ()=>{
    console.log(`server started: http://localhost:${port}`);
})