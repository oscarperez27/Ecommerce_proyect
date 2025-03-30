import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const send = sequelize.define('Send', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    packageDimensions: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    costumerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fragile: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    extraInformation: {
        type: DataTypes.STRING,
        allowNull: false,
    },   
    extraInformation: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    delivered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    deliveryDate: {
        type: DataTypes.DATE
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW,
    },
}, {
    timestamps: false,
    tableName: 'send',
});

sequelize.sync({ force: true }) 
    .then(() => console.log("Tabla 'send' sincronizada correctamente"))
    .catch(err => console.error("Error al sincronizar la tabla 'send':", err));

export default send;