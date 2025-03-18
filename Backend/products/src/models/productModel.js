import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define('Product',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    price:{
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    dimensions:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productMarlk: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    material: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photo: {
        type: DataTypes.STRING,
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW,
    },

}, {
    timestamps:false, //Desactiva createdAt y ipdatedAt
    tableName: 'products', //Nombre de la tabla de bd
});

sequelize.sync({ alter: true })
    .then(() => console.log("Tabla 'products' sincronizada correctamente"))
    .catch(err => console.error("Error al sincronizar la tabla 'users':", err));

export default Product;