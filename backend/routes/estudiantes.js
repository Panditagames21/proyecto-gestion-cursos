import express from 'express';
import { getEstudiantes, addEstudiante } from '.../controllers/estudianteController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getEstudiantes);

// Rutas protegidas
router.post('/', verifyToken, addEstudiante);

export default router;