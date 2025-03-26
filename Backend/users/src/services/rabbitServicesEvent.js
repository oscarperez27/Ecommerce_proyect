import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_HOST;
const RABBITMQ_EXCHANGE = "user_event";
const RABBITMQ_ROUTING_KEY = "user.created";

export async function userCreatedEvent(user) {
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

const RABBITMQ_EXCHANGE_FORGET = "user_event_forget";
const RABBITMQ_ROUTING_KEY_FORGET = "user.forget";

export async function userForgetEvent(username, newPassword) {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    //Declarar el Exange
    await channel.assertExchange(RABBITMQ_EXCHANGE_FORGET, "topic" ,{ durable:true});

    //Publicar el evento
    const message = JSON.stringify({ username, newPassword });
    channel.publish(RABBITMQ_EXCHANGE_FORGET, RABBITMQ_ROUTING_KEY_FORGET, Buffer.from(message));

    console.log(`exange "${RABBITMQ_EXCHANGE_FORGET}",
        routing key "${RABBITMQ_ROUTING_KEY_FORGET}": ${message}`);

    setTimeout(() => {
        connection.close();
    }, 5000);
}