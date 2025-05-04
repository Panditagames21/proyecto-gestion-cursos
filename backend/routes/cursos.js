import express from 'express';
import { getCursos, addCurso } from '../controllers/cursosController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getCursos);

// Rutas protegidas
router.post('/', verifyToken, addCurso);

export default router;