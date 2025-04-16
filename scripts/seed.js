const faker = require('faker');
const { pool } = require('../config/database');
require('dotenv').config();

// Configurar faker para usar español
faker.locale = 'es';

async function seedDatabase() {
  try {
    // Generar 20 clientes aleatorios
    const clientes = [];
    for (let i = 0; i < 20; i++) {
      clientes.push([
        faker.name.findName(),
        faker.internet.email(),
        faker.phone.phoneNumber(),
        faker.address.streetAddress()
      ]);
    }

    // Insertar clientes en la base de datos
    const [resultClientes] = await pool.query(
      'INSERT INTO clientes (nombre, email, telefono, direccion) VALUES ?',
      [clientes]
    );
    console.log(`${resultClientes.affectedRows} clientes insertados`);

    // Generar 30 productos aleatorios
    const productos = [];
    const categorias = ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes'];
    
    for (let i = 0; i < 30; i++) {
      productos.push([
        faker.commerce.productName(),
        faker.commerce.productDescription(),
        parseFloat(faker.commerce.price(10, 1000, 2)),
        faker.datatype.number({ min: 0, max: 100 }),
        faker.random.arrayElement(categorias)
      ]);
    }

    // Insertar productos en la base de datos
    const [resultProductos] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES ?',
      [productos]
    );
    console.log(`${resultProductos.affectedRows} productos insertados`);

    console.log('Base de datos poblada con datos aleatorios');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    // Cerrar la conexión
    await pool.end();
  }
}

// Ejecutar la función si este archivo se ejecuta directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 