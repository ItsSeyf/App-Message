import { createClient } from "@libsql/client"
import { connection } from '../config/config.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

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

const hours = (fecha1, fecha2) => {
    const milliseconds = 86400000

    const diff = new Date(fecha2) - new Date(fecha1);

    return diff >= milliseconds;
}

await db.execute('Create table if not exists users ( id integer primary key autoincrement,username Varchar(100), name varchar(50), password text, email text, login_failed integer default 0, login_date text, resets integer default 0, resets_date text)')

await db.execute('Create unique index if not exists I_username on users(username)')

await db.execute(
    'Create table if not exists messages ( id integer primary key autoincrement,sender Varchar(100), receiver varchar(100), messages text, created_at text)')

await db.execute(
    'Create table if not exists blocked ( id integer primary key autoincrement, username varchar(100), blocked_user varchar(100), constraint fk_blocked foreign key (username) references users(username), constraint fk_blockedU foreign key (blocked_user) references users(username))')

await db.execute(
    'Create table if not exists agenda ( id integer primary key autoincrement, username varchar(100), person varchar(100), constraint fk_agenda foreign key(username) references users(username), constraint fk_agendaP foreign key(person) references users(username))')

export class MessagesModel {
    static async getALL({ input }) {
        try {
            if (input.username && input.receiver) {
                const result = await db.execute({
                    sql: 'select id, name, sender, receiver, messages, created_at from messages where (sender = :username and receiver = :receiver) or (sender = :receiver and receiver = :username) inner join users on messages.sender = users.username order by created_at desc',
                    args: { username: input.username, receiver: input.receiver }
                })
                return result.rows.length > 0 ? result.rows : null
            }
            return null;
        } catch (e) {
            console.error(e)
            return null;
        }
    }
    static async create({ input }) {
        const { sender, receiver, messages, created_at } = input.data
        try {
            const isblocked = await db.execute({
                sql: 'select * from blocked where (username = :sender and blocked_user = :receiver) or (username = :receiver and blocked_user = :sender)',
                args: { sender, receiver }
            })
            if (isblocked.rows.length > 0) {
                return null;
            }
            const isUserExists = await db.execute({
                sql: 'select * from users where username = :username',
                args: { username: receiver }
            })
            if (isUserExists.rows.length === 0) {
                return null;
            }
            const result = await db.execute({
                sql: 'insert into messages(sender, receiver, messages, created_at) values(:sender, :receiver, :msg, :created_at)',
                args: {
                    sender,
                    receiver,
                    msg: messages,
                    created_at
                }
            })
            if (result === undefined || result === null || result.rowsAffected === 0) {
                return null;
            }
            const message = await db.execute({
                    sql: 'select id, name, sender, receiver, messages, created_at from messages where messages.id = :id inner join users on messages.sender = users.username order by created_at desc',
                    args: { id: result.lastInsertRowid }
                })
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message.rows[0])), {
                persistent: true,
            });
            return message.rows[0];
        } catch (e) {
            console.error(e)
        }
    }
    static async getAgenda({ username }) {
        try {
            const result = await db.execute({
                sql: 'select users.username, users.name from agenda, users where agenda.username = :username and agenda.person = users.username',
                args: { username }
            })
            return result.rows.length > 0 ? result.rows : null
        } catch (e) {
            console.error(e)
            return null
        }
    }
    static async createAgenda({ input }) {
        const { username, receiver } = input
        try {
            const isblocked = await db.execute({
                sql: 'select * from blocked where (username = :username and blocked_user = :receiver) or (username = :receiver and blocked_user = :username)',
                args: { username, receiver }
            })
            const isUserExists = await db.execute({
                sql: 'select * from users where username = :receiver',
                args: { receiver }
            })
            if (isblocked.rows.length > 0 || isUserExists.rows.length === 0) {
                return null;
            }
            const result = await db.execute({
                sql: 'insert into agenda (username, person) values( :username, :person), (:person, :username)',
                args: { username, person }
            })
            return result.rowsAffected > 0 ? 'ok' : null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    static async login({ input }) {
        const { username, password } = input
        try {
            const result = await db.execute({
                sql: 'select login_failed from users where username = :username',
                args: { username: username }
            })
            if (result.rows[0].login_failed > 4) {
                const date = new Date();
                await db.execute({
                    sql: 'update users set login_date = :date where username = :username',
                    agrs: {date, username}
                })
                return 0;
            }
            if(result.rows[0].login_date !== undefined || result.rows[0].login_date !== null){
                const now = new Date();
                const before = new Date(result.rows[0].login_date);
                if(hours(before, now)=== false){
                    return 0;
                }else{
                    const result = await db.execute({
                        sql: 'update users set login_failed = 0, login_date=null where username = :username',
                        agrs: {username}
                    })
                    if(result.rowsAffected===0){
                        return null;
                    }
                }
            }
            const usuario = await db.execute({
                sql: 'select username, password, name from users where username = :username',
                args: { username: username }
            })
            const userpassword = usuario.rows[0].password
            const valid = await bcrypt.compare(password, userpassword)
            if (!valid) {
                await db.execute({
                    sql: 'update users set login_failed = login_failed + 1 where username = :username',
                    args: { username: username }
                })
                return null;
            }
            const createdtoken = token({ input: { username: usuario.rows[0].username, id: usuario.rows[0].id } });
            return createdtoken;
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
            if (result.rowsAffected === 0 || !result || deleteFromAgenda.rowsAffected === 0 || !deleteFromAgenda) {
                return null;
            }
            return 'ok';
        } catch (e) {
            console.error(e);
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
            if (result === undefined || result === null || result.rowsAffected === 0) {
                return null;
            }
            const user = await db.execute({
                sql: 'select id, username, password from users where username = :username',
                args: { username: username }
            })
            const createdtoken = token({ input: { username: user.rows[0].username, id: user.rows[0].id } });
            result.token = createdtoken;
            return result;
        } catch (e) {
            console.error(e)
        }
    }
    static async unlockUser({ input }) {
        const { blocked, username } = input;
        try {
            const result = await db.execute({
                sql: 'delete from blocked where blocked_user = :blocked and username = :username',
                args: { blocked, username }
            })
            return result ? 'ok' : null;
        } catch (e) {
            console.error(e)
            return null;
        }
    }
    static async getBlockedUsers({ username }) {
        try {
            const result = await db.execute({
                sql: 'select users.username, users.name from blocked, users where blocked.username = :username and blocked.blocked_user = users.username',
                args: { username }
            })
            return result.rows;
        } catch (e) {
            console.error(e)
            return null;
        }
    }
    static async editMessage({ input }) {
        const { id, message, username} = input;
        try {
            const result = await db.execute({
                sql: 'select id from messages where id = :id and sender = :username',
                args: { username, id }
            })
            if (result === null || result === undefined || result.rows.length === 0) {
                return null;
            }
            const update = await db.execute({
                sql: 'update messages set messages = :message where id = :id and sender = :username',
                args: { message, id, username }
            })
            if (!update || update.rowsAffected === 0) {
                return null;
            }
            return 'ok';
        } catch (e) {
            console.error(e)
            return null;
        }
    }
    static async deleteMessage({ input }) {
        try {
            const { username, id } = input;

            const result = await db.execute({
                sql: 'select id from messages where sender = :username and id=:id',
                args: { username, id: id }
            })
            if (result.rows.length === 0) {
                return null;
            }
            const remove = await db.execute({
                sql: 'delete from messages where id = :id',
                args: { id: id }
            })
            if (!remove || remove.rowsAffected === 0) {
                return null;
            }
            return 'ok'
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    static async getResetlink({ username }) {
        try {
            const result = await db.execute({
                sql: 'select id, email, resets, resets_date from users where username = :username',
                args: { username }
            })
            if (result.rows[0].resets_date) {
                const before = new Date(result.rows[0].resets_date)
                const now = new Date();
                if (hours(before, now) === false) {
                    return null
                } else {
                    const result = await db.execute({
                        sql: 'update users set resets = 0, resets_date = null where username = :username',
                        args: {username}
                    })
                    if(result.rowsAffected===0){
                        return null;
                    }
                }
            }
            if (result.rows.length === 0 || !result.rows[0].email) {
                return null;
            }
            if(result.rows[0].resets >2){
                const date = new Date();
                await db.execute({
                    sql: 'update users set resets_date = :date where username =:username',
                    args: { username: result.rows[0].username, date }
                })
                return null;
            }
            const update = await db.execute({
                sql: 'update users set resets = resets +1 where username = :username',
                args: { username: result.rows[0].username }
            })
            if (update.rowsAffected === 0) return null;
            const token = jwt.sign({
                user_id: result.rows[0].id,
                type: "password_reset"
            }, process.env.SECRET_KEY, {
                expiresIn: '15m'
            }
            )
            const resend = new Resend(process.env.URL_RESEND)
            const { data, error } = resend.emails.send({
                from: 'onboarding@resend.dev',
                to: result.rows[0].email,
                subject: 'Password Reset',
                html: `<a href=${token}><strong>Click on this to reset your password!</strong>!</a> </br> <p><strong> This link is available for only 15 minutes</strong></p> `
            })
            if (error) {
                await db.execute({
                    sql: 'update users set resets = resets -1 where username = :username',
                    args: { username: result.rows[0].username }
                })
                console.error(error);
                return null;
            }
            console.log(data);
            return 1;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    static async resetpassword({ input }) {
        const { token, password } = input;
        try {
            const data = jwt.verify(token, process.env.SECRET_RESET)
            const { id } = data;
            const clear = await db.execute({
                sql: 'update users set login_failed=0 where id=:id',
                args: {id}
            })
            if(clear.rowsAffected===0){
                return null;
            }
            const hashedpassword = await bcrypt.hash(password, 10)
            const result = await db.execute({
                sql: 'update users set password= :hashedpassword where id = :id',
                args: { hashedpassword, id }
            })
            if (!result || result.rowsAffected === 0) {
                return null;
            }
            return 1;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    static async changeAccountDetails({ input }) {
        try {
            const { username } = input;
            const { newPassowrd, email, name } = input.data;
            if (newPassowrd !== undefined && newPassowrd !== null) {
                const hashedpassword = await bcrypt.hash(newPassowrd, 10);
                const result = await db.execute({
                    sql: 'update users set password = :password, name = :name, email =:email where username = :username',
                    args: { password: hashedpassword, name, email, username }
                })
                if (result.rowsAffected === 0) {
                    return null;
                }
            }
            if (!email && !name) {
                return null;
            }
            const result = await db.execute({
                sql: 'update users set name = :name, email =:email where username = :username',
                agrs: { name, email, username }
            })
            if (result.rowsAffected === 0) {
                return null;
            }
            return 1;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    static async getAccountDetails({ input }) {
        try {
            const { username } = input;
            const result = await db.execute({
                sql: 'select username, name, email from users where username =: username',
                args: { username }
            })
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}