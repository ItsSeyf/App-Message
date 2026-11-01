import {connection} from '../config/config.js'

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
                        console.log('Sending message:', item);
                        io.to(`user:${messages.receiver}`).emit('message', messages);
                    }
                } else {
                    console.log('Sending message:', messages);
                    io.to(`user:${messages.receiver}`).emit('message', messages);
                }
                channel.ack(msg)
            }catch(e){
                console.error(e);
                channel.nack(msg, false, false);
                return res.status(500).json({error: 'Error processing message'});
            }
        }
    })
}
export {consumeMessages}