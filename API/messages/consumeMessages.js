import {connection} from '../config/config.js'
import {MessagesModel} from '../models/messages.js'

async function consumeMessages(io) {
    const queue = 'MessageQueue';
    const {channel} = await connection(queue);
    channel.consume(queue, async (msg)=>{
        if(msg){
            try{
                const content = msg.content.toString();
                const messages = JSON.parse(content)
                if (Array.isArray(messages)) {
                    for(const item of messages){
                        const result = await MessagesModel.MessageDatabase({input : item})
                        if(!result){
                            throw new Error('Error inserting message into database')
                        }
                        console.log('Sending message:', item);
                        io.emit('message', item)
                    }
                } else {
                    const result= await MessagesModel.MessageDatabase({input : messages})
                    if(!result){
                        throw new Error('Error inserting message into database')
                    }
                    console.log('Sending message:', messages);
                    io.emit('message', messages)
                }
                channel.ack(msg)
            }catch(e){
                console.error(e)
            }
        }
    })
}
export {consumeMessages}