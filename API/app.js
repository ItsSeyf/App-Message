import express, {json} from 'express';
import { corsMiddleware } from './middlewares/cors.js';
import {createServer} from 'node:http'
import {Server} from 'socket.io'
import {messagesRouter} from './routes/messages.js'
import {consumeMessages} from './consumeMessages.js'

const app= express();
const server=createServer(app);

const io= new Server(server, {
    cors :{
        origin: '*',
        methods: ['GET', 'POST']
    },
});

app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by');

app.use('/messages', messagesRouter)

consumeMessages(io)

const Port= 1234;

server.listen(Port, ()=>{
    console.log(`Server is running on port http://localhost:${Port}`);
})