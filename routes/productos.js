const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ mensaje: 'Error al obtener producto', error: error.message });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    
    if (!nombre || !precio) {
      return res.status(400).json({ mensaje: 'Nombre y precio son obligatorios' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, stock || 0, categoria]
    );
    
    const [newProducto] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newProducto[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    
    const [result] = await pool.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ? WHERE id = ?',
      [nombre, descripcion, precio, stock, categoria, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    const [updatedProducto] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    res.json(updatedProducto[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
});

module.exports = router;
