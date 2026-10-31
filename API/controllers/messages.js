import { MessagesModel } from '../models/messages.js'
import cookieParser from 'cookie-parser'
import SECRET_KEY from '../config/config.js'

const token = (input) => {
    try {
        const token = input.cookies.access_token
        const data = jwt.verify(token, SECRET_KEY);
        return data;
    } catch (e) {
        return null;
    }
}

const clearCookie = (res) => {
    res.clearCookie('access_token')
}

export class MessagesController {
    static async getALL(req, res) {
        const data = token(req);
        if (data === null) {
            clearCookie(res);
            return res.status(401).json({ error: 'Error invalid token' })
        }
        const { username } = data;
        const { receiver } = req.query;
        const messages = await MessagesModel.getALL({ input: { username, receiver } })
        res.status(200).json(messages)
    }
    static async createMessage(req, res) {
        const data = token(req);
        if (data === null) {
            clearCookie(res);
            return res.status(401).json({ error: 'Error invalid token' })
        }
        const message = await MessagesModel.create({ input: req.body })
        if (!message) {
            return res.status(404).json({ error: 'Message not created' })
        }
        res.status(201).json(message)
    }
    static async login(req, res) {
        try {
            const result = await MessagesModel.login({ input: req.body })
            if (result) {
                res.cookie('access_token', result.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 24
                })
                    .status(200).json(result)
            } else {
                res.status(404).json({ error: 'User not found' })
            }
        } catch (error) {
            res.status(500).json({ error: 'Error to login' })
        }
    }
    static async register(req, res) {
        const user = await MessagesModel.register({ input: req.body })
        if (!user) {
            return res.status(404).json({ error: 'User not created' })
        }
        res.status(201).json(user).cookie('access_token', user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 24
        })
    }
    static async logout(req, res) {
        res.clearCookie('access_token').json({ message: 'Logout successful' })
    }
    static async createAgenda(req, res) {
        const data = token(req);
        if (data === null){
            clearCookie(res);
            return res.status(401).json({ error: 'Error invalid token' })
        }
        const {username} = data;
        const {receiver} = req.body;
        const result = await MessagesModel.createAgenda({input: {username, receiver}})
        if(result === null){
            return res.status(404).json({ error: 'User not added to agenda'})
        }
        return res.status(200).json({message: 'User added to agenda'})
    }

    static async getAgenda(req, res){
        const data = token(req);
        if (data === null){
            clearCookie(res);
            return res.status(401).json({ error: 'Error invalid token' })
        }
        const {username} = data;
        const result = await MessagesModel.getAgenda({input: {username}})
        if(result === null){
            return res.status(404).json({ error: 'Agenda not founded'})
        }
        return res.status(200).json(result)
    }

    static async block(req, res) {
        const data = token(req);
        if (data === null) {
            clearCookie(res);
            return res.status(401).json({ error: 'Error invalid token' })
        }
        const { username } = data;
        const { blocked } = req.body;
        const result = await MessagesModel.block({ input: { username, blocked } });
        if (result === null) {
            return res.status(404).json({ error: 'User not blocked' })
        }
        return res.status(200).json({ message: 'User blocked successfully' })
    }
}