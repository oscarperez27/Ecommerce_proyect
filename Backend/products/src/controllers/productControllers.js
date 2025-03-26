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