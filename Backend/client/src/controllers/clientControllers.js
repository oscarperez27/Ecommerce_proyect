import Client from '../models/clientModel.js';
import { clientCreatedEvent } from '../services/rabbitServicesEvent.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

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
        
        const newUser = {
            password:"12345678",
            username:email,
            phone:phone
        }

        const response = await axios.post('http://api_users:3001/api/users', newUser);
        console.log('Respuesta del servidor:', response.data);
        
        //Agregar la funcion
        /*
        try{
            await clientCreatedEvent(newClient);
        } catch (error){
            console.log("Error al registrar el cliente");
        }
        */

        return res.status(201).json({ message: "Cliente creado", data: newClient });

    } catch (error) {
        console.error("Error al crear el cliente:", error);
        return res.status(500).json({ message: "Error al crear el cliente" });
    }
};

export const updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, last_name, email, phone, direction } = req.body;

    const existingEmail = await Client.findOne({ where: { email } });
    if (existingEmail) {
        return res.status(400).json({ message: "El Correo ya está registrado, favor de cambiarlo" });
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
