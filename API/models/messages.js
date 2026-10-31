import { createClient } from "@libsql/client"
import dotenv from 'dotenv'
import { connection } from '../config/config.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();
const queue = 'MessageQueue';
const { channel } = await connection(queue);

const db = createClient({
    url: process.env.DB_URL,
    authToken: process.env.DB_TOKEN
})

const token = (input) => {
    return jwt.sign(
        { id: input.id, username: input.username },
        process.env.SECRET_KEY,
        { expiresIn: '24h' });
}

await db.execute('Create table if not exists users ( id integer primary key autoincrement,username Varchar(100), name varchar(50), password text)')

await db.execute('Create if not exists unique index I_username on users(username)')

await db.execute(
    'Create table if not exists messages ( id integer primary key autoincrement,sender Varchar(100), receiver varchar(100), messages text, created_at text)')

await db.execute(
    'Create table if not exists blocked ( id integer primary key autoincrement, username varchar(100), blocked_user varchar(100), constraint fk_blocked foreign key (username, blocked_user) references users(username) )')

await db.execute(
    'Create table if not exists agenda ( id integer primary key autoincrement, username varchar(100), person varchar(100), constraint fk_agenda foreign key(username, person) references users(username))')
await db.execute(
    'Create table if not exists  ( id integer primary key autoincrement,  )')

export class MessagesModel {
    static async getALL({ input }) {
        try {
            if (input.username && input.receiver) {
                const result = await db.execute({
                    sql: 'select sender, name, receiver, messages, created_at from messages where (sender = :username and receiver = :receiver) or (sender = :receiver and receiver = :username) inner join users on messages.sender = users.username order by created_at desc',
                    args: { username: input.username, receiver: input.receiver }
                })
                const messages = result.rows
                return result ? messages : null
            }
            return null;
        } catch (e) {
            console.error(e)
            return null;
        }
    }
    static async create({ input }) {
        const { sender, receiver, messages, fecha } = input
        const mensaje = { sender, receiver, messages, fecha }
        try {
            const isblocked = await db.execute({
                sql: 'select * from blocked where (username = :sender and blocked_user = :receiver) or (username = :receiver and blocked_user = :sender)',
                args: { sender, receiver }
            })
            if (isblocked.rows.length > 0) {
                return null;
            }
            const result = await db.execute({
                sql: 'insert into messages(sender, receiver, messages, created_at) values(:sender, :receiver, :msg, :created_at)',
                args: {
                    sender,
                    receiver,
                    msg: messages,
                    created_at: fecha
                }
            })
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(mensaje)), {
                persistent: true,
            });
            return result ? 'ok' : null
        } catch (e) {
            console.error(e)
        }
    }
    static async MessageDatabase({ input }) {
        const { sender, receiver, messages, created_at } = input
        try {
            let result = await db.execute({
                sql: 'insert into messages(sender, receiver, messages, created_at) values(:sender, :receiver, :msg, :created_at)',
                args: {
                    sender,
                    receiver,
                    msg: messages,
                    created_at
                }
            })
            return result ? 'ok' : null
        } catch (e) {
            console.error(e)
        }
    }
    static async getAgenda({ username }) {
        try {
            const result = await db.execute({
                sql: 'select person from agenda where username = :username',
                args: { username }
            })
            return result ? result.rows : null
        } catch (e) {
            console.error(e)
            return null
        }
    }
    static async createAgenda({ input }) {
        const { username } = input
        try {
            const isblocked = await db.execute({
                sql: 'select * from blocked where (username = :username and blocked_user = :receiver) or (username = :receiver and blocked_user = :username)',
                args: { username, receiver }
            })
            if (blocked.rows.length > 0) {
                return null;
            }
            const result = await db.execute({
                sql: 'insert into agenda (username, person) values( :username, :person)',
                args: { username, person }
            })
            return result ? 'ok' : null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    static async login({ input }) {
        const { username, password } = input
        try {
            const usuario = await db.execute({
                sql: 'select username, password, name from users where username = :username',
                args: { username: username }
            })
            const userpassword = usuario.rows[0].password
            const valid = await bcrypt.compare(password, userpassword)
            if (!valid) {
                return null;
            }
            const token = token({ input: { username: usuario.rows[0].username, id: usuario.rows[0].id } });
            return token;
        } catch (e) {
            console.error(e)
            return null;
        }
    }
    static async block({ input }) {
        const { username, blocked } = input
        try {
            const result = await db.execute({
                sql: 'insert into blocked (username, blocked_user) values(:username , :blocked)',
                args: { username, blocked }
            })
            const deleteFromAgenda = await db.execute({
                sql: 'delete from agenda where (username = :username and person = :blocked) or (username = :blocked and person = :username)',
                args: { username, blocked }
            })

            return result && deleteFromAgenda ? 'ok' : null;
        } catch (e) {
            return null;
        }
    }
    static async register({ input }) {
        const { username, password, name } = input
        const hashedpassword = await bcrypt.hash(password, 10)
        try {
            const usuario = await db.execute({
                sql: 'select username, password from users where username = :username',
                args: { username: username }
            })
            if (usuario.rows.length > 0) {
                return null
            }
            const result = await db.execute({
                sql: 'insert into users(username, password, name) values(:username, :password, :name)',
                args: {
                    username,
                    password: hashedpassword,
                    name
                }
            })
            const user = await db.execute({
                sql: 'select id, username, password from users where username = :username',
                args: { username: username }
            })
            const token = token({ input: { username: user.rows[0].username, id: user.rows[0].id } });
            if (result === undefined || result === null) {
                return null;
            }
            result.token = token;
            return result;
        } catch (e) {
            console.error(e)
        }
    }
}