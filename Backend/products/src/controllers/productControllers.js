import Product from '../models/productModel.js';
import jwt from 'jsonwebtoken';

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
    const { name, price, dimensions, weight, description, productMarlk, material, photo } = req.body;

    try {
        
        const newProduct = await Product.create({
            name, 
            price, 
            dimensions, 
            weight, 
            description, 
            productMarlk, 
            material, 
            photo,
            creationDate: new Date(),
        });

        console.log(newProduct);

        return res.status(201).json({ message: "Producto registrado", data: newProduct });

    } catch (error) {
        console.error("Error al registrar producto:", error);
        return res.status(500).json({ message: "Error al registrar el producto" });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { price, dimensions, weight, description, productMarlk, material, photo } = req.body;

    try{
        const product = await Product.findByPk(id);
        if (!product){
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        await product.update({
            price: price || product.price,
            dimensions: dimensions || product.dimensions,
            weight: weight || product.weight,
            description: description || product.description,
            productMarlk: productMarlk || product.productMarlk,
            material: material || product.material,
            photo: photo || product.photo,
        });

        return res.status(201).json({ message: "Producto actualizado", data: product });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return res.status(500).json({ message: "Error al actualizar el producto" });
    }
};

/*
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
*/