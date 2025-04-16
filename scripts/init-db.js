const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  // Crear conexión sin especificar base de datos
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

  try {
    // Crear la base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Base de datos ${process.env.DB_NAME} creada o ya existente`);

    // Usar la base de datos
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Crear tabla de clientes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        telefono VARCHAR(20),
        direccion TEXT,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabla clientes creada o ya existente');

    // Crear tabla de productos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        categoria VARCHAR(50),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabla productos creada o ya existente');

    console.log('Inicialización de la base de datos completada');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    await connection.end();
  }
}

// Ejecutar la función si este archivo se ejecuta directamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase; 