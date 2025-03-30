import Send from '../models/sendModel.js';
import jwt from 'jsonwebtoken';

export const saludar = async (req, res) => {
    try{
        return res.status(200).json({ message: "hola"});
    } catch (error) {
        return res.status(500).json({ message: "Error al saludar"});
    }
};

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

    if (!weight || !packageDimensions || !destination || !origin || !address || !costumerName || !fragile || !extraInformation) {
        return res.status(400).json({ message: 'Campos vacíos, favor de llenar todos los campos' });
    }

    try {
        const newSend = await Send.create({
            weight,
            packageDimensions,
            destination,
            origin,
            address,
            costumerName,
            fragile,
            extraInformation,
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

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
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