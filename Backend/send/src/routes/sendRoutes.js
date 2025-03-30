import express from "express";
import { saludar, getSends, createSend, updateSend, deleteSend, deliveredSend } from "../controllers/sendControllers.js";

const router = express.Router();

router.get('/test', saludar);
router.get('/', getSends);
router.post('/', createSend);
router.patch('/:id', updateSend);
router.delete('/:id', deleteSend);
router.patch('/delivered/:id', deliveredSend);


export default router;

