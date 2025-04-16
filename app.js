const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Importar rutas
const clientesRoutes = require('./routes/clientes');
const productosRoutes = require('./routes/productos');

// Importar configuración de base de datos
const { testConnection } = require('./config/database');
const initializeDatabase = require('./scripts/init-db');

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 9000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Usar las rutas
app.use('/clientes', clientesRoutes);
app.use('/productos', productosRoutes);

// Función para iniciar el servidor
async function startServer() {
  try {
    // Inicializar la base de datos
    await initializeDatabase();
    
    // Verificar la conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('No se pudo conectar a la base de datos. El servidor se iniciará de todos modos.');
    }
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`Rutas disponibles:`);
      console.log(`- http://localhost:${PORT}/`);
      console.log(`- http://localhost:${PORT}/clientes`);
      console.log(`- http://localhost:${PORT}/productos`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

// Iniciar el servidor
startServer();
