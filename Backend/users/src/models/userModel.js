import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define('User',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: 'users', //Nombre de la tabla de bd
});

sequelize.sync({ alter: true })
    .then(() => console.log("Tabla 'users' sincronizada correctamente"))
    .catch(err => console.error("Error al sincronizar la tabla 'users':", err));

export default User;