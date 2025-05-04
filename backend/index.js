import express from 'express';
import cors from 'cors';
import estudiantesRoutes from './routes/estudiantes.js';
import cursosRoutes from './routes/cursos.js';
import inscripcionesRoutes from './routes/inscripciones.js';

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
