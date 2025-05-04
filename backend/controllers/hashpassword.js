import bcrypt from 'bcryptjs';
import { pool } from './config/db.js';

// Función para hashear una contraseña
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Script para actualizar las contraseñas existentes en la base de datos
const updatePasswords = async () => {
  try {
    console.log('Iniciando actualización de contraseñas...');
    
    // Obtener conexión
    const connection = await pool.getConnection();
    
    try {
      // Recuperar todos los usuarios
      const [users] = await connection.query('SELECT id, email, password FROM usuarios');
      
      if (users.length === 0) {
        console.log('No se encontraron usuarios para actualizar');
        return;
      }
      
      console.log(`Se encontraron ${users.length} usuarios para actualizar`);
      
      // Actualizar cada contraseña
      for (const user of users) {
        // Verificar si la contraseña ya está hasheada (comienza con $2a$)
        if (user.password && !user.password.startsWith('$2a$')) {
          const hashedPassword = await hashPassword(user.password);
          
          // Actualizar en la base de datos
          await connection.query(
            'UPDATE usuarios SET password = ? WHERE id = ?',
            [hashedPassword, user.id]
          );
          
          console.log(`✅ Contraseña actualizada para: ${user.email}`);
        } else {
          console.log(`ℹ️ La contraseña de ${user.email} ya está hasheada o está vacía`);
        }
      }
      
      console.log('Actualización de contraseñas completada');
      
    } catch (error) {
      console.error('Error durante la actualización de contraseñas:', error);
    } finally {
      // Liberar conexión
      connection.release();
    }
    
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  } finally {
    // Cerrar el pool de conexiones
    await pool.end();
  }
};

// Generar hashes para mostrar en la consola
const generateExampleHashes = async () => {
  const passwords = ['1234', '1212', '4321'];
  
  console.log('Ejemplos de hashes de contraseñas:');
  
  for (const password of passwords) {
    const hash = await hashPassword(password);
    console.log(`Contraseña: ${password} => Hash: ${hash}`);
  }
};

// Función principal
const main = async () => {
  // Si se pasa el argumento --generate-only, solo mostrar ejemplos
  if (process.argv.includes('--generate-only')) {
    await generateExampleHashes();
  } else {
    // Ejecutar la actualización
    await updatePasswords();
  }
};

// Ejecutar el script
main();