import express from "express";
import { getClient, createClient, updateClient, deleteClient } from '../controllers/clientControllers.js'

const router = express.Router();

router.get('/', getClient);
router.post('/', createClient);
router.patch('/:id', updateClient);
router.delete('/:id', deleteClient);

/**
 * @swagger
 * tags:
 *   - name: Clients
 *     description: The clients managing API
 *
 * /api/client:
 *   get:
 *     summary: Get all Clients
 *     tags: 
 *       - Clients
 *     responses:
 *       200:
 *         description: A successful response
 *   post:
 *     summary: Register a new client
 *     tags: 
 *       - Clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan carlos
 *               last_name:
 *                 type: string
 *                 example: Bodoque
 *               email:
 *                 type: string
 *                 example: mario_3141230104@utd.edu.mx
 *               phone:
 *                 type: string
 *                 example: 6181667980 
 *               born_date:
 *                 type: date
 *                 example: 2004-12-09
 *               direction:
 *                 type: string
 *                 example: Por su casa
 *     responses:
 *       201:
 *         description: User successfully created
 * /api/client/{id}:
 *   put:
 *     summary: Update Client information
 *     tags: 
 *       - Client
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan carlos
 *               last_name:
 *                 type: string
 *                 example: Bodoque
 *               email:
 *                 type: string
 *                 example: mario_3141230104@utd.edu.mx
 *               phone:
 *                 type: string
 *                 example: 6181667980 
 *               direction:
 *                 type: string
 *                 example: Por su casa
 *     responses:
 *       200:
 *         description: Client successfully updated
 *   delete:
 *     summary: Delete a Client
 *     tags: 
 *       - Client
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User successfully deleted
*/

export default router;