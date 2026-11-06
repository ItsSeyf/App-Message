import { Router } from "express";
import {MessagesController} from "../controllers/messages.js";
import {tokenisvalid} from "../middlewares/cors.js"
import { MessagesModel } from "../models/messages.js";

export const messagesRouter=Router();

messagesRouter.post('/login', MessagesController.login);

messagesRouter.post('/register', MessagesController.register);

messagesRouter.get('/reset', MessagesModel.getResetlink)

messagesRouter.post('/reset', MessagesModel.resetpassword)

messagesRouter.use(tokenisvalid);

messagesRouter.get('/', MessagesController.getALL);

messagesRouter.post('/', MessagesController.createMessage);

messagesRouter.post('/logout', MessagesController.logout);

messagesRouter.get('/agenda', MessagesController.getAgenda);

messagesRouter.post('/agenda', MessagesController.createAgenda);

messagesRouter.post('/block', MessagesController.block);

messagesRouter.post('/unblock', MessagesController.unblock);

messagesRouter.get('/blocked', MessagesController.getBlocked);

messagesRouter.patch('/', MessagesController.editMessage)

messagesRouter.delete('/', MessagesController.delteMessage)