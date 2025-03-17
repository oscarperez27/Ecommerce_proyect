import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Client = sequelize.define('Client',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    born_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    direction:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:true,
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW,
    },

}, {
    timestamps:false, //Desactiva createdAt y ipdatedAt
    tableName: 'client', //Nombre de la tabla de bd
});

sequelize.sync({ alter: true })
    .then(() => console.log("Tabla 'client' sincronizada correctamente"))
    .catch(err => console.error("Error al sincronizar la tabla 'users':", err));

export default Client;