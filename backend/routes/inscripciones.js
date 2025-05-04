import express from 'express';
import {
  inscribirEstudiante,
  obtenerInscripcionesPorEstudiante,
  eliminarInscripcion
} from '../controllers/inscripcionController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas de inscripciones están protegidas
router.post('/', verifyToken, inscribirEstudiante);
router.get('/:estudianteId', verifyToken, obtenerInscripcionesPorEstudiante);
router.delete('/:id', verifyToken, eliminarInscripcion);

export default router;
