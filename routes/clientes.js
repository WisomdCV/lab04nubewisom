const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener clientes', error: error.message });
  }
});

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ mensaje: 'Error al obtener cliente', error: error.message });
  }
});

// Crear un nuevo cliente
router.post('/', async (req, res) => {
  try {
    const { nombre, email, telefono, direccion } = req.body;
    
    if (!nombre || !email) {
      return res.status(400).json({ mensaje: 'Nombre y email son obligatorios' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, email, telefono, direccion) VALUES (?, ?, ?, ?)',
      [nombre, email, telefono, direccion]
    );
    
    const [newCliente] = await pool.query('SELECT * FROM clientes WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newCliente[0]);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ mensaje: 'Error al crear cliente', error: error.message });
  }
});

// Actualizar un cliente
router.put('/:id', async (req, res) => {
  try {
    const { nombre, email, telefono, direccion } = req.body;
    
    const [result] = await pool.query(
      'UPDATE clientes SET nombre = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?',
      [nombre, email, telefono, direccion, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    const [updatedCliente] = await pool.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    res.json(updatedCliente[0]);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ mensaje: 'Error al actualizar cliente', error: error.message });
  }
});

// Eliminar un cliente
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ mensaje: 'Error al eliminar cliente', error: error.message });
  }
});

module.exports = router;
