import { MessagesModel } from '../models/messages.js'

export class MessagesController {
    static async getALL(req, res) {
        const { username } = req.user;
        const { receiver } = req.body;
        if(!receiver){
            return res.status(400).json({messsage: 'The information is incomplete'})
        }
        const messages = await MessagesModel.getALL({ input: { username, receiver } })
        res.status(200).json(messages)
    }
    static async createMessage(req, res) {
        const { username } = req.user;
        const message = await MessagesModel.create({ input: { username, data: req.body } })
        if (!message) {
            return res.status(404).json({ error: 'Message not created' })
        }
        res.status(201).json(message)
    }
    static async login(req, res) {
        const result = await MessagesModel.login({ input: req.body })
        if (result) {
            res.cookie('access_token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 24
            })
                .status(200).json(result)
        } else if (result === 0) {
            res.status(403).json({ message: 'Login blocked' })
        } else {
            res.status(404).json({ error: 'User not found' })
        }
    }
    static async register(req, res) {
        const user = await MessagesModel.register({ input: req.body })
        if (!user) {
            return res.status(404).json({ error: 'User not created' })
        }
        res.status(201).cookie('access_token', user.token, {
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
        const { username } = req.user;
        const { receiver } = req.body;
        if(!receiver){
            return res.status(400).json({messsage: 'The information is incomplete'})
        }
        const result = await MessagesModel.createAgenda({ input: { username, receiver } })
        if (result === null) {
            return res.status(404).json({ error: 'User not added to agenda' })
        }
        return res.status(200).json({ message: 'User added to agenda' })
    }

    static async getAgenda(req, res) {
        const { username } = req.user;
        const result = await MessagesModel.getAgenda({ input: { username } })
        if (result === null) {
            return res.status(404).json({ error: 'Agenda not founded' })
        }
        return res.status(200).json(result)
    }

    static async block(req, res) {
        const { username } = req.user;
        const { blocked } = req.body;
        if(!blocked){
            return res.status(400).json({messsage: 'The information is incomplete'})
        }
        const result = await MessagesModel.block({ input: { username, blocked } });
        if (result === null) {
            return res.status(500).json({ error: 'User not blocked' })
        }
        return res.status(200).json({ message: 'User blocked successfully' })
    }
    static async unblock(req, res) {
        const { username } = req.user;
        const { blocked } = req.body;
        if(!blocked){
            return res.status(400).json({messsage: 'The information is incomplete'})
        }
        const result = await MessagesModel.unblock({ input: { username, blocked } });
        if (result === null) {
            return res.status(500).json({ error: 'User not unblocked' })
        }
        return res.status(200).json({ message: 'User unblocked successfully' })
    }
    static async getBlocked(req, res) {
        const { username } = req.user;
        const result = await MessagesModel.getBlocked({ input: { username } });
        return res.status(200).json(result)
    }
    static async editMessage(req, res) {
        const { username } = req.user;
        const result = await MessagesModel.editMessage({ input: username, data: req.body })
        if (result === null) {
            return res.status(500).json({ message: 'Message not edited' })
        }
        return res.status(200).json({ message: 'Message edited' })
    }
    static async delteMessage(req, res) {
        const { username } = req.user;
        const result = await MessagesModel.deleteMessage({ input: username, data: req.body })
        if (result === null) {
            return res.status(500).json({ message: 'Message not deleted' })
        }
        return res.status(200).json({ message: 'Message deleted' })
    }

    static async getResetLink(req, res) {
        const {username} = req.body
        if(!username){
            return res.status(400).json({messsage: 'The information is incomplete'})
        }
        const result = await MessagesModel.getResetlink({username});
        if(result=== null){
            return res.status(500).json({message: 'Error sending email'})
        }
        return res.status(200).json({message: 'Email sent'});
    }
    static async resetPassword(req, res){
        const {token, password} = req.body
        if(!password){
            return res.status(400).json({messsage: 'The information is incomplete'})
        }
        const result = await MessagesModel.resetpassword({input: {token, password}})
        if(result=== null){
            return res.status(500).json({message: 'Error reseting the password'})
        }
        return res.status(200).json({message: 'Password was reset'})
    }
    static async changeAccountDetails(req, res){
        const {username} = req.user;
        const result = await MessagesModel.changePassword({input: {username, data: req.body}})
        if(result=== null){
            return res.status(500).json({message: 'Error changing the account details'})
        }
        return res.status(200).json({message: 'Account details updated'})
    }
    static async getAccountDetails(req, res){
        const {username} = req.user;
        const result = await MessagesModel.getAccountDetails({input: {username}})
        if(result=== null){
            return res.status(404).json({message: 'Error getting the details'})
        }
        return res.status(200).json({message: 'Password modified'})
    }
}