import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_HOST;
const RABBITMQ_EXCHANGE = "client_event";
const RABBITMQ_ROUTING_KEY = "client.created";

export async function clientCreatedEvent(user) {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    //Declarar el Exange
    await channel.assertExchange(RABBITMQ_EXCHANGE, "topic" ,{ durable:true});

    //Publicar el evento
    const message = JSON.stringify(user);
    channel.publish(RABBITMQ_EXCHANGE, RABBITMQ_ROUTING_KEY, Buffer.from(message));

    console.log(`exange "${RABBITMQ_EXCHANGE}",
        routing key "${RABBITMQ_ROUTING_KEY}": ${message}`);

    setTimeout(() => {
        connection.close();
    }, 5000);
}