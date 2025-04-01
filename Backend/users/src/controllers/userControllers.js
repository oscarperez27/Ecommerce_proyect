import User from '../models/userModel.js';
import { userCreatedEvent, userForgetEvent } from '../services/rabbitServicesEvent.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const saludar = async (req, res) => {
    try{
        return res.status(200).json({ message: "hola"});
    } catch (error) {
        return res.status(500).json({ message: "Error al saludar"});
    }
};

export const getUsers = async (req, res) => {
    try{
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error en la sistama de usuario: ', error);
        res.status(500)
            .json({ message: 'Error al obtener los usuarios' });
    }
};

export const createUser = async (req, res) => {
    const { password, username, phone } = req.body;

    // Validación de campos
    if (!phone || !username || !password) {
        return res.status(400).json({ message: "Campos vacíos, favor de llenar todos los campos" });
    }

    // Validación de username/correo
    /*
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexCorreo.test(username)) {  // Ahora se valida correctamente
        return res.status(400).json({ message: "El correo no tiene el formato apropiado" });
    }
    */
    const existing = await User.findOne({ where: { username } });
    if (existing) {
        return res.status(400).json({ message: "Usuario existente, favor de cambiar el usuario" });
    }

    // Validación de phone (convertido a string para evitar errores)
    /*
    if (String(phone).length < 10) {
        return res.status(400).json({ message: "El teléfono tiene menos de 10 caracteres" });
    }
    */

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
        return res.status(400).json({ message: "El teléfono ya está registrado, favor de cambiarlo" });
    }

    // Validación de password
    /*
    if (password.length < 8) {  // Corregido el mensaje
        return res.status(400).json({ message: "El password debe tener al menos 8 caracteres" });
    }
    */

    try {
        const newUser = await User.create({
            phone,
            username,
            password,
            status: true,
            creationDate: new Date(),
        });

        console.log(newUser);
        //Agregar la funcion
        try{
            await userCreatedEvent(newUser);
        } catch (error){
            console.log("Algo fallo");
        }

        return res.status(201).json({ message: "Usuario creado", data: newUser });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        return res.status(500).json({ message: "Error al crear el usuario" });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { password, phone } = req.body;

    //Validacion de contraseña
    /*tamaño de contraseña */
    if (password.length < 8) {  // Corregido el mensaje
        return res.status(400).json({ message: "El password debe tener al menos 8 caracteres" });
    }
    //Validacion de telefono
    /*telefono no reguistrado, tamaño del telefono */
    if (String(phone).length < 10) {
        return res.status(400).json({ message: "El teléfono tiene menos de 10 caracteres" });
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
        return res.status(400).json({ message: "El teléfono ya está registrado, favor de cambiarlo" });
    }

    try{
        const user = await User.findByPk(id);
        if (!user){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.update({
            phone: phone || user.phone,
            password: password || user.password,
        });

        return res.status(201).json({ message: "Usuario actualizado", data: user });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).json({ message: "Error al actualizar el usuario" });
    }
};

export const DeleteUsers = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try{
        const user = await User.findByPk(id);
        if (!user){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.update({
            status: false,
        });
        
        return res.status(201).json({ message: "Usuario dado de baja", data: user });
    } catch (error) {
        console.error("Error al dar de baja usuario:", error);
        return res.status(500).json({ message: "Error al dar de baja usuario" });
    }
};

export const login = async (req, res) => {
    try{
        const {username,password} = req.body;
    
        const existingUser = await User.findOne({ where: { username, password} });
    
        if (existingUser) {
            const SECRET_KEY = 'aJksd9QzPl+sVdK7vYc/L4dK8HgQmPpQ5K9yApUsj3w';
    
            const token = jwt.sign({id:existingUser.id, username:existingUser.username}, SECRET_KEY, {expiresIn: "1h"});
    
            return res.status(200).json({message:"User start login", data:token});
        }else{
            return res.status(200).json({message:"No existe el usuario"});
        }
    }catch(error){
        console.error("Error :", error);
        return res.status(500).json({message:"Error"});
    }
}

export async function createUserByClient(password, username, phone){
    
    try {
        const newUser = await User.create({
            phone,
            username,
            password,
            status: true,
            creationDate: new Date(),
        });

        console.log(newUser);
        //Agregar la funcion
        try{
            await userCreatedEvent(newUser);
        } catch (error){
            console.log("Algo fallo");
        }

        return res.status(201).json({ message: "Usuario creado", data: newUser });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        return res.status(500).json({ message: "Error al crear el usuario" });
    }
};

export const forgetPassword = async (req, res) => {
    const { username } = req.body;

    try{
        const user = await User.findOne({
            where: { username: username }
        });
        
        if (!user){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        //Generador de passwords
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }

        await user.update({
            password: result,
        });

        userForgetEvent(username, result);

        return res.status(201).json({ message: "Usuario olvido la contraseña" });
    } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        return res.status(500).json({ message: "Error al restablecer contraseña del usuario" });
    }
};