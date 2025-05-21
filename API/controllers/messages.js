import {MessagesModel} from '../models/messages.js'
export class MessagesController{
    static async getALL(req, res){
        try {
            const {username} = req.query
            const messages = await MessagesModel.getALL( {username} )
            res.status(200).json(messages)
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving messages' })
        }
    }
    static async createMessage(req, res){
        const message = await MessagesModel.create({input : req.body})
        if (!message) {
            return res.status(404).json({ error: 'Message not created' })
        }
        res.status(201).json(message)
    }
    static async login(req, res){
        try {
            const result = await MessagesModel.login({input: req.body})
            if(result){
                res.status(200).json(result)
            }else{
                res.status(404).json({ error: 'User not found' })
            }
        } catch (error) {
            res.status(500).json({ error: 'Error to login' })
        }
    }
    static async register(req, res){
        const user = await MessagesModel.register({input : req.body})
        if (!user) {
            return res.status(404).json({ error: 'User not created' })
        }
        res.status(201).json(user)
    }
}