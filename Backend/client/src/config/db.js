import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST, //Dreccionamiento del host por medio de variables e entorno
        dialect: 'mysql',
        logging: false, //Activarlo para ver las consultas SQL
    }
);

sequelize.authenticate()
    .then(() => console.log('Conexión con éxito.'))
    .catch(err => console.error('No se conectos: ', err));

export default sequelize;