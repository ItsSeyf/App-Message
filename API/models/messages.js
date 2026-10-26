import { createClient } from "@libsql/client"
import dotenv from 'dotenv'
import {connection} from '../config/config.js'
import bcrypt from 'bcrypt'

dotenv.config();
const queue = 'MessageQueue';
const {channel} = await connection(queue);

const db=createClient({
    url : process.env.DB_URL,
    authToken : process.env.DB_TOKEN
})

await db.execute('Create table if not exists users ( id integer primary key autoincrement,username Varchar(100), name varchar(50), password text)')

await db.execute(
    'Create table if not exists messages ( id integer primary key autoincrement,sender Varchar(100), receiver varchar(100), messages text, created_at text)')

export class MessagesModel{
    static async getALL( {username} ){
        try{
            if(username){
                const result = await db.execute({
                    sql:'select sender, receiver, name, messages, created_at from messages, users where (sender = :username or receiver = :username) and (sender = users.username or receiver = users.username) order by created_at desc',
                    args: {username}
                })
                const messages = result.rows
                return result ? messages : null
            }
            return null;
        }catch(e){
            console.error(e)
        }
    }
    static async create({input}){
        const {sender, receiver, messages, fecha}=input
        const mensaje = {sender, receiver, messages, fecha}
        try{
            let result = await db.execute({
                sql: 'insert into messages(sender, receiver, messages, created_at) values(:sender, :receiver, :msg, :created_at)',
                args:{
                    sender,
                    receiver,
                    msg : messages,
                    created_at : fecha
                }
            })
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(mensaje)),{
                persistent: true,
            });
            return result ? 'ok' : null
        }catch(e){
            console.error(e)
        }
    }
    static async MessageDatabase({input}){
        const {sender, receiver, messages, created_at}=input
        try{
            let result = await db.execute({
                sql: 'insert into messages(sender, receiver, messages, created_at) values(:sender, :receiver, :msg, :created_at)',
                args:{
                    sender,
                    receiver,
                    msg : messages,
                    created_at
                }
            })
            return result ? 'ok' : null
        }catch(e){
            console.error(e)
        }
    }
    static async login( {input} ){
        const {username, password}=input
        try{
            const usuario = await db.execute({
                sql:'select username, password, name from users where username = :username',
                args: {username : username}
            })
            const userpassword= usuario.rows[0].password
            const valid= await bcrypt.compare(password, userpassword)
            return valid ? 'ok' : null
        }catch(e){
            console.error(e)
        }
    }
    static async register( {input} ){
        const {username, password, name}=input
        const hashedpassword= await bcrypt.hash(password, 10)
        try{
            const usuario = await db.execute({
                sql:'select username, password from users where username = :username',
                args: {username : username}
            })
            if(usuario.rows.length>0){
                return null
            }
            let result = await db.execute({
                sql: 'insert into users(username, password, name) values(:username, :password, :name)',
                args:{
                    username,
                    password : hashedpassword,
                    name
                }
            })
            return result ? 'ok' : null
        }catch(e){
            console.error(e)
        }
    }
}