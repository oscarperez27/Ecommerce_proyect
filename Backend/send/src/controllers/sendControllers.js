import Send from '../models/sendModel.js';
import jwt from 'jsonwebtoken';

export const saludar = async (req, res) => {
    try{
        return res.status(200).json({ message: "hola"});
    } catch (error) {
        return res.status(500).json({ message: "Error al saludar"});
    }
};

// Validar cadenas vacias
const isValidString = (value, maxLength = 255) => typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;


// Obtener todos los envíos
export const getSends = async (req, res) => {
    try {
        const sends = await Send.findAll();
        res.status(200).json(sends);
    } catch (error) {
        console.error('Error al obtener los envíos: ', error);
        res.status(500).json({ message: 'Error al obtener los envíos' });
    }
};

export const createSend = async (req, res) => {
    const { weight, packageDimensions, destination, origin, address, costumerName, fragile, extraInformation } = req.body;
    
    console.log(1641561);
    console.log(costumerName);
    /*
    if (!weight || !isValidString(packageDimensions) || !isValidString(destination) || !isValidString(origin) || !isValidString(address) || !isValidString(costumerName) || fragile === undefined || !isValidString(extraInformation)) {
        return res.status(400).json({ message: 'Campos vacíos o inválidos, favor de llenar todos los campos correctamente' });
    }
    
    if (typeof weight !== 'number' || weight <= 0) {
        return res.status(400).json({ message: 'El peso debe ser un número positivo y puede contener decimales' });
    }
    if (typeof fragile !== 'boolean') {
        return res.status(400).json({ message: 'Fragile debe ser un valor booleano' });
    }
    */

    try {
        const newSend = await Send.create({
            weight,
            packageDimensions,
            destination,
            origin,
            address,
            fragile,
            costumerName,
            extraInformation,
            delivered: false,
            creationDate: new Date(),
        });

        return res.status(201).json({ message: 'Envío creado', data: newSend });
    } catch (error) {
        console.error('Error al crear el envío:', error);
        return res.status(500).json({ message: 'Error al crear el envío' });
    }
};

// Actualizar un envío
export const updateSend = async (req, res) => {
    const { id } = req.params;
    const { weight, packageDimensions, destination, origin, address, costumerName, fragile, extraInformation } = req.body;

    /*
    if (!id || !Number.isInteger(Number(id))) {
        return res.status(400).json({ message: 'ID inválido, debe ser un número entero' });
    }

    if (weight !== undefined && (typeof weight !== 'number' || weight <= 0)) {
        return res.status(400).json({ message: 'El peso debe ser un número positivo y puede contener decimales' });
    }
    if (fragile !== undefined && typeof fragile !== 'boolean') {
        return res.status(400).json({ message: 'Fragile debe ser un valor booleano' });
    }
    if (packageDimensions !== undefined && !isValidString(packageDimensions)) {
        return res.status(400).json({ message: 'Dimensiones del paquete inválidas' });
    }
    if (destination !== undefined && !isValidString(destination)) {
        return res.status(400).json({ message: 'Destino inválido' });
    }
    if (origin !== undefined && !isValidString(origin)) {
        return res.status(400).json({ message: 'Origen inválido' });
    }
    if (address !== undefined && !isValidString(address)) {
        return res.status(400).json({ message: 'Dirección inválida' });
    }
    if (costumerName !== undefined && !isValidString(costumerName)) {
        return res.status(400).json({ message: 'Nombre del cliente invalido' });
    }
    if (extraInformation !== undefined && !isValidString(extraInformation)) {
        return res.status(400).json({ message: 'Informacion adicional invalida ' });
    }
    */

    try {
        const send = await Send.findByPk(id);
        if (!send) {
            return res.status(404).json({ message: 'Envío no encontrado' });
        }

        await send.update({
            weight: weight || send.weight,
            packageDimensions: packageDimensions || send.packageDimensions,
            destination: destination || send.destination,
            origin: origin || send.origin,
            address: address || send.address,
            costumerName: costumerName || send.costumerName,
            fragile: fragile || send.fragile,
            extraInformation: extraInformation || send.extraInformation
        });

        return res.status(201).json({ message: 'Envío actualizado', data: send });
    } catch (error) {
        console.error('Error al actualizar el envío:', error);
        return res.status(500).json({ message: 'Error al actualizar el envío' });
    }
};

export const deleteSend = async (req, res) => {
    const { id } = req.params;

    if (!id || !Number.isInteger(Number(id))) {
        return res.status(400).json({ message: 'ID inválido, debe ser un número entero' });
    }

    try {
        const send = await Send.findByPk(id);
        if (!send) {
            return res.status(404).json({ message: 'Envío no encontrado' });
        }

        await send.destroy();

        return res.status(201).json({ message: 'Envío eliminado', data: send });
    } catch (error) {
        console.error('Error al eliminar el envío:', error);
        return res.status(500).json({ message: 'Error al eliminar el envío' });
    }
};

export const deliveredSend = async (req, res) => {
    const { id } = req.params;

    if (!id || !Number.isInteger(Number(id))) {
        return res.status(400).json({ message: 'ID inválido, debe ser un número entero' });
    }

    try {
        const send = await Send.findByPk(id);
        if (!send) {
            return res.status(404).json({ message: 'Envío no encontrado' });
        }

        await send.update({
            delivered: true,
            deliveryDate: new Date(),
        });

        return res.status(201).json({ message: 'Envío entregado', data: send });
    } catch (error) {
        console.error('Error al eliminar el envío:', error);
        return res.status(500).json({ message: 'Error al entregar el envío' });
    }
};