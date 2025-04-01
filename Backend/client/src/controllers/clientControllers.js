import Client from '../models/clientModel.js';
import { clientCreatedEvent } from '../services/rabbitServicesEvent.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Validar cadenas vacías
const isValidString = (value, maxLength = 255) => typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;

export const getClient = async (req, res) => {
    try{
        const client = await Client.findAll();
        res.status(200).json(client);
    } catch (error) {
        console.error('Error en la sistama de clientes: ', error);
        res.status(500)
            .json({ message: 'Error al obtener los clientes' });
    }
};

export const createClient = async (req, res) => {
    const { name, last_name, email, phone, born_date, direction } = req.body;

    // Validación de campos
    if (!isValidString(name) || !isValidString(last_name) || !isValidString(email) || !isValidString(direction)) {
        return res.status(400).json({ message: "Campos vacíos o inválidos, favor de llenar todos los campos correctamente" });
    }

    // Validación de correo
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexCorreo.test(email)) {
        return res.status(400).json({ message: "El correo no tiene el formato apropiado" });
    }

    // Validación de telefono
    if (String(phone).length < 10) {
        return res.status(400).json({ message: "El teléfono tiene menos de 10 caracteres" });
    }

    // Validación de fecha de nacimiento
    const date = new Date(born_date);
    if (date.toString() === 'Invalid Date') {
        return res.status(400).json({ message: "La fecha de nacimiento no tiene el formato apropiado" });
    }

    // Validación de correo existente
    const existing = await Client.findOne({ where: { email } });
    if (existing) {
        return res.status(400).json({ message: "Correo existente, favor de cambiar el correo" });
    } 

    // Validación de teléfono existente
    const existingPhone = await Client.findOne({ where: { phone } });
    if (existingPhone) {
        return res.status(400).json({ message: "El teléfono ya está registrado, favor de cambiarlo" });
    }


    try {
        const newClient = await Client.create({
            name,
            last_name,
            email,
            phone,
            born_date,
            direction,
            status: true,
            creationDate: new Date(),
        });
        
        console.log(newClient);
        
        //Agregar la funcion
        await clientCreatedEvent(newClient);

        return res.status(201).json({ message: "Cliente creado", data: newClient });

    } catch (error) {
        console.error("Error al crear el cliente:", error);
        return res.status(500).json({ message: "Error al crear el cliente" });
    }
};

export const updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, last_name, email, phone, direction } = req.body;

    if (name !== undefined && !isValidString(name)) {
        return res.status(400).json({ message: "Nombre inválido" });
    }
    if (last_name !== undefined && !isValidString(last_name)) {
        return res.status(400).json({ message: "Apellido inválido" });
    }
    if (email !== undefined && !isValidString(email)) {
        return res.status(400).json({ message: "Correo inválido" });
    }
    if (direction !== undefined && !isValidString(direction)) {
        return res.status(400).json({ message: "Dirección inválida" });
    }

    // Validación de correo
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !regexCorreo.test(email)) {
        return res.status(400).json({ message: "El correo no tiene el formato apropiado" });
    }

    // Validación de teléfono
    if (phone && String(phone).length < 10) {
        return res.status(400).json({ message: "El teléfono tiene menos de 10 caracteres" });
    }

    // Validación de correo existente
    const existingEmail = await Client.findOne({ where: { email } });
    if (existingEmail) {
        return res.status(400).json({ message: "El Correo ya está registrado, favor de cambiarlo" });
    }

    // Validación de teléfono existente
    const existingPhone = await Client.findOne({ where: { phone } });
    if (existingPhone) {
        return res.status(400).json({ message: "El teléfono ya está registrado, favor de cambiarlo" });
    }

    try{
        const client = await Client.findByPk(id);
        if (!client){
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        await client.update({
            name: name || Client.name,
            last_name: last_name || Client.last_name,
            email: email || Client.email,
            phone: phone || Client.phone,
            direction: direction || Client.direction,
        });

        return res.status(201).json({ message: "Cliente actualizado", data: client });
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        return res.status(500).json({ message: "Error al actualizar el cliente" });
    }
};

export const deleteClient = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try{
        const client = await Client.findByPk(id);
        if (!client){
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        await client.update({
            status: false,
        });
        
        return res.status(201).json({ message: "Cliente dado de baja", data: client });
    } catch (error) {
        console.error("Error al dar de baja al cliente:", error);
        return res.status(500).json({ message: "Error al dar de baja al cliente" });
    }
};
