import jwt from 'jsonwebtoken';

// Clave secreta para JWT - Idealmente debe estar en variables de entorno
const JWT_SECRET = 'secreto';

export const verifyToken = (req, res, next) => {
  // Obtener el token del header o de las cookies
  const authHeader = req.headers.authorization;
  
  // Verificar que el header exista
  if (!authHeader) {
    console.log('❌ No se proporcionó token de autenticación');
    return res.status(401).json({ 
      success: false, 
      message: 'Acceso denegado. No se proporcionó token de autenticación' 
    });
  }
  
  // Extraer el token (Bearer token)
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : authHeader;
  
  if (!token) {
    console.log('❌ Token no encontrado en el header de autorización');
    return res.status(401).json({ 
      success: false, 
      message: 'Acceso denegado. Token no encontrado' 
    });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Añadir los datos del usuario a la petición
    req.user = decoded;
    
    // Pasar al siguiente middleware
    next();
  } catch (error) {
    console.error('❌ Error de verificación de token:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado. Por favor, inicie sesión nuevamente' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};