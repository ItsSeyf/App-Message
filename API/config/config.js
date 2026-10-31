import amqp from 'amqplib'
async function connection(queue) {
    try{
    const connection = await amqp.connect(dotenv.env.URL_RABBIT);
    const channel= await connection.createChannel();
    await channel.assertQueue(queue, {durable : false})
    return {connection, channel}
    }catch(e){
        console.error(e)
    }
}

export {connection}