import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBIT_HOST;

export async function userEvents() {
    try{
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
    
        const exchange = 'user_event';
        const queue = 'user_created_queue';
        const routingKey = 'user.created';

        await channel.assertExchange(exchange, 'topic', {durable:true});
        await channel.assertQueue(queue, {durable: true});
        await channel.bindQueue(queue, exchange, routingKey);

        console.log(`Waiting for a message in ${queue}`);
        let response = {};
        channel.consume(queue, (msq) => {
            if (msq != null){
                response = JSON.parse(msq.content.toString())
                console.log(response)

                channel.ack(msq);
            }
        }, {noAck: false });

        connection.on('close', () => {
            console.error('Conexion cerrada, intentando reconectar en 5 seg');
            setTimeout(userEvents, 5000);
        });
    } catch (error){
        console.error('Error conectando a RabbitMQ', error.message);
        console.log('Reintentando en 5s');
        setTimeout(userEvents, 5000);
    }
}