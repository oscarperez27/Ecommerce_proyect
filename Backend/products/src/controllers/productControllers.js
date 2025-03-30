import Product from '../models/productModel.js';
import jwt from 'jsonwebtoken';
import multer from "multer";
import fs from 'fs';
import path from 'path';

export const saludar = async (req, res) => {
    try{
        return res.status(200).json({ message: "hola"});
    } catch (error) {
        return res.status(500).json({ message: "Error al saludar"});
    }
};

// Validar cadenas vacías
const isValidString = (value, maxLength = 255) => typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;

export const getProduct = async (req, res) => {
    try{
        const Products = await Product.findAll();
        res.status(200).json(Products);
    } catch (error) {
        console.error('Error en la sistama de productos: ', error);
        res.status(500)
            .json({ message: 'Error al obtener los productos' });
    }
};

export const createProduct = async (req, res) => {
    const { name, price, dimensions, weight, description, productMarlk, material } = req.body;

    // Validar que los campos obligatorios no estén vacíos
    if (!isValidString(name) || !isValidString(dimensions) || !isValidString(description) || !isValidString(productMarlk) || !isValidString(material)) {
        return res.status(400).json({ message: "Campos vacíos o inválidos, favor de llenar todos los campos correctamente" });
    }

    //Validar que el precio sea un número
    if (isNaN(price)) {
        return res.status(400).json({ message: "El precio debe ser un número" });
    }

    //Validar que el peso sea un número
    if (isNaN(weight)) {
        return res.status(400).json({ message: "El peso debe ser un número" });
    }

    //Validar las dimensiones que acepte cm y m
    const dimensionRegex = /^(?:\d+(?:\.\d+)?\s*(?:cm|m))$/i;
    if (!dimensionRegex.test(dimensions)) {
        return res.status(400).json({ message: "Las dimensiones deben tener el formato correcto" });
    }

    /*
    //Validar que la imagen sea un archivo de tipo imagen
        if (req.file && !req.file.mimetype.startsWith("image")) {
        return res.status(400).json({ message: "El archivo debe ser una imagen" });
    }
    */
    

    try {
        // Si hay una imagen en la petición, se guarda su ruta
        let photoUrl = req.file ? `../../uploads/${req.file.filename}` : null;

        const newProduct = await Product.create({
            name,
            price,
            dimensions,
            weight,
            description,
            productMarlk,
            material,
            photo: photoUrl, // Se guarda la URL de la imagen en la base de datos
            creationDate: new Date(),
        });

        console.log(newProduct);

        return res.status(201).json({ message: "Producto registrado", data: newProduct });

    } catch (error) {
        console.error("Error al registrar producto:", error);
        return res.status(500).json({ message: "Error al registrar el producto" });
    }
};

// Obtener __dirname en un módulo ES
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { price, dimensions, weight, description, productMarlk, material } = req.body;

    // Validar que el producto exista
    const productExists = await Product.findByPk(id);
    if (!productExists) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Validar que el precio sea un número
    if (price && isNaN(price)) {
        return res.status(400).json({ message: "El precio debe ser un número" });
    }

    // Validar que el peso sea un número
    if (weight && isNaN(weight)) {
        return res.status(400).json({ message: "El peso debe ser un número" });
    }

    if (dimensions !== undefined && !isValidString(dimensions)) {
        return res.status(400).json({ message: "Dimensiones inválidas" });
    }
    if (description !== undefined && !isValidString(description)) {
        return res.status(400).json({ message: "Descripción inválida" });
    }
    if (productMarlk !== undefined && !isValidString(productMarlk)) {
        return res.status(400).json({ message: "Marca del producto inválida" });
    }
    if (material !== undefined && !isValidString(material)) {
        return res.status(400).json({ message: "Material inválido" });
    }

    const photo = req.file ? `../../uploads/${req.file.filename}` : null;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (photo && product.photo) {
            
            const oldImagePath = path.join(__dirname, '', product.photo);

            try {
                await fs.promises.access(oldImagePath); // Verificar si el archivo existe
                await fs.promises.unlink(oldImagePath); // Eliminar la imagen anterior
                console.log("Imagen anterior eliminada correctamente");
            } catch (err) {
                console.error("Error al eliminar la imagen anterior:", err);
            }
        }

        const updatedProduct = await product.update({
            price: price || product.price,
            dimensions: dimensions || product.dimensions,
            weight: weight || product.weight,
            description: description || product.description,
            productMarlk: productMarlk || product.productMarlk,
            material: material || product.material,
            photo: photo || product.photo,
        });

        return res.status(200).json({ message: "Producto actualizado", data: updatedProduct });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return res.status(500).json({ message: "Error al actualizar el producto" });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (product.photo) {
            // Definir la ruta del archivo de la imagen
            const imagePath = path.join(__dirname, '', product.photo);
            
            fs.exists(imagePath, (exists) => {
                if (exists) {
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error("Error al eliminar la imagen:", err);
                        } else {
                            console.log("Imagen eliminada correctamente");
                        }
                    });
                } else {
                    console.log("Imagen no encontrada:", imagePath);
                }
            });
        }

        // Eliminar el producto de la base de datos
        await product.destroy();

        return res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        return res.status(500).json({ message: "Error al eliminar el producto" });
    }
};