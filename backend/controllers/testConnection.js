import { pool, testConnection } from './config/db.js';

// Script para verificar la conexión a la base de datos y la estructura de la tabla usuarios
const runDiagnostics = async () => {
  try {
    console.log('Iniciando diagnóstico de conexión a la base de datos...');
    
    // Probar la conexión
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ No se pudo establecer la conexión. Verifique:');
      console.error('   1. Que el servidor MySQL esté en ejecución');
      console.error('   2. Que las credenciales en db.js sean correctas');
      console.error('   3. Que la base de datos "gestion" exista');
      process.exit(1);
    }
    
    // Si la conexión es exitosa, verificar la estructura de la tabla usuarios
    const connection = await pool.getConnection();
    
    try {
      // Verificar si la tabla existe
      const [tables] = await connection.query(
        'SHOW TABLES LIKE "usuarios"'
      );
      
      if (tables.length === 0) {
        console.error('❌ La tabla "usuarios" no existe en la base de datos');
        console.log('Creando tabla de usuarios...');
        
        // Crear tabla si no existe
        await connection.query(`
          CREATE TABLE usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            nombre VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        console.log('✅ Tabla "usuarios" creada correctamente');
        
        // Crear un usuario de prueba
        const hashPassword = await bcrypt.hash('123456', 10);
        await connection.query(`
          INSERT INTO usuarios (email, password, nombre)
          VALUES ('test@example.com', ?, 'Usuario de Prueba')
        `, [hashPassword]);
        
        console.log('✅ Usuario de prueba creado: test@example.com (contraseña: 123456)');
      } else {
        // Verificar estructura de la tabla
        const [columns] = await connection.query(
          'SHOW COLUMNS FROM usuarios'
        );
        
        console.log('✅ Estructura de la tabla "usuarios":');
        columns.forEach(col => {
          console.log(`   - ${col.Field} (${col.Type}${col.Null === 'NO' ? ', NOT NULL' : ''}${col.Key === 'PRI' ? ', PRIMARY KEY' : ''})`);
        });
        
        // Verificar si hay usuarios
        const [count] = await connection.query(
          'SELECT COUNT(*) as total FROM usuarios'
        );
        
        console.log(`✅ Total de usuarios en la base de datos: ${count[0].total}`);
      }
      
    } catch (error) {
      console.error('❌ Error al verificar la tabla:', error);
    } finally {
      // Liberar la conexión
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  } finally {
    // Cerrar el pool de conexiones
    await pool.end();
    console.log('Diagnóstico finalizado');
  }
};

// Ejecutar el diagnóstico
runDiagnostics();