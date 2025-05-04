import { db } from '../config/db.js';

// Inscribir un estudiante a un curso
export const inscribirEstudiante = (req, res) => {
  const { estudiante_id, curso_id } = req.body;

  if (!estudiante_id || !curso_id) {
    return res.status(400).json({ error: 'Estudiante y curso son requeridos' });
  }

  db.query(
    'INSERT INTO inscripciones (estudiante_id, curso_id) VALUES (?, ?)',
    [estudiante_id, curso_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al inscribir estudiante' });
      res.json({ message: 'Inscripción realizada correctamente', inscripcionId: result.insertId });
    }
  );
};

// Obtener cursos en los que está inscrito un estudiante
export const obtenerInscripcionesPorEstudiante = (req, res) => {
  const id = req.params.estudianteId;

  db.query(
    `SELECT cursos.id, cursos.nombre FROM inscripciones 
     JOIN cursos ON inscripciones.curso_id = cursos.id 
     WHERE inscripciones.estudiante_id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al obtener inscripciones' });
      res.json(result);
    }
  );
};

// Eliminar una inscripción
export const eliminarInscripcion = (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM inscripciones WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar inscripción' });
    res.json({ message: 'Inscripción eliminada correctamente' });
  });
};