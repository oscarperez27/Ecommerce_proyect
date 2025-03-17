import amqp from 'amqplib';
import dotenv from 'dotenv';
import { createUserByClient } from './../controllers/userControllers.js'

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_HOST;

export async function userEvents() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        
        const exchange = 'client_event';
        const queue = 'client_created_queue';
        const routingKey = 'client.created';

        await channel.assertExchange(exchange, 'topic', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);

        console.log(`Waiting for a message in ${queue}`);
        channel.consume(queue, async (msg) => {
            if (msg != null) {
                const response = JSON.parse(msg.content.toString());
                console.log(response);
                
                //Crea usuario
                createUserByClient(response.password, response.username, response.phone);
            }
        }, { noAck: false });

        connection.on('close', () => {
            console.error('Connection closed, attempting to reconnect in 5 seconds');
            setTimeout(userEvents, 5000);
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error.message);
        console.log('Retrying in 5 seconds');
        setTimeout(userEvents, 5000);
    }
}
