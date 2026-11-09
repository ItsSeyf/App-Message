import express, {json} from 'express';
import { corsMiddleware } from './middlewares/cors.js';
import {createServer} from 'node:http'
import {Server} from 'socket.io'
import {messagesRouter} from './routes/messages.js'
import {consumeMessages} from './messages/consumeMessages.js'
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app= express();
const server=createServer(app);

const io= new Server(server, {
    cors :{
        origin: '*',
        methods: ['GET', 'POST']
    },
});

io.engine.use(cookieParser());

io.use((socket, next)=>{
    const token = socket.request.cookies?.access_token;
    if(!token){
        return next(new Error('unauthorized'));
    }
    try{
        socket.data.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
    }catch{
        next(new Error('unauthorized'));
    }
});

io.on('connection',(socket)=>{
    const username =socket.data.user.username;
    if(!username){
        socket.disconnect(true);
        return;
    }
    socket.join(`user:${username}`);
} )

app.use(json())
app.use(corsMiddleware())
app.use(cookieParser());
app.disable('x-powered-by');

app.use('/messages', messagesRouter)

consumeMessages(io)

const Port= 1234;

server.listen(Port, ()=>{
    console.log(`Server is running on port http://localhost:${Port}`);
})