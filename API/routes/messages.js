import { Router } from "express";
import {MessagesController} from "../controllers/messages.js";

export const messagesRouter=Router();

messagesRouter.get('/', MessagesController.getALL);

messagesRouter.post('/', MessagesController.createMessage);

messagesRouter.post('/login', MessagesController.login);

messagesRouter.post('/register', MessagesController.register);

