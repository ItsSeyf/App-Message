import amqp from 'amqplib'
const urlrabbit='amqps://fjbbyfvv:hl6BN2BMNfxmPU9bSZ4NkitcSvej4fqM@gull.rmq.cloudamqp.com/fjbbyfvv'

async function connection(queue) {
    try{
    const connection = await amqp.connect(urlrabbit);
    const channel= await connection.createChannel();
    await channel.assertQueue(queue, {durable : false})
    return {connection, channel}
    }catch(e){
        console.error(e)
    }
}

export {connection}