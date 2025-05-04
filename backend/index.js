const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL en Laragon
const db = mysql.createConnection({
  host: 'localhost',       // o 127.0.0.1
  user: 'root',
  password: '',            // sin contraseña por defecto en Laragon
  database: 'gestion'      // nombre de tu base de datos
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos gestion');
  }
});

// Ruta de login
app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;

  const query = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';
  db.query(query, [usuario, contrasena], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    if (results.length > 0) {
      return res.json({ success: true, usuario: results[0] });
    } else {
      return res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas' });
    }
  });
});

app.listen(3001, () => {
  console.log('Servidor backend escuchando en http://localhost:3001');
});
