import { db } from '../config/db.js';

// Obtener todos los cursos
export const getCursos = (req, res) => {
  db.query('SELECT * FROM cursos', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener cursos' });
    res.json(results);
  });
};

// Agregar un nuevo curso con validación
export const addCurso = (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
  }

  const query = 'INSERT INTO cursos (nombre, descripcion) VALUES (?, ?)';
  db.query(query, [nombre, descripcion], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al agregar curso' });
    res.json({ message: 'Curso agregado correctamente', cursoId: result.insertId });
  });
};