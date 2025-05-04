import { db } from '../config/db.js';

// Obtener todos los estudiantes
export const getEstudiantes = (req, res) => {
  db.query('SELECT * FROM estudiantes', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener estudiantes' });
    res.json(results);
  });
};

// Agregar un nuevo estudiante con validación básica
export const addEstudiante = (req, res) => {
  const { nombre, email } = req.body;

  // Validación simple
  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }

  // Insertar en la base de datos
  const query = 'INSERT INTO estudiantes (nombre, email) VALUES (?, ?)';
  db.query(query, [nombre, email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al agregar estudiante' });
    res.json({ message: 'Estudiante agregado correctamente', estudianteId: result.insertId });
  });
};