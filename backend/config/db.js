const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '', // Ajusta esto según tu configuración
  database: 'gestion',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear un pool de conexiones en lugar de una única conexión
export const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    return false;
  }
};

// Inicializar la conexión al importar este módulo
testConnection();