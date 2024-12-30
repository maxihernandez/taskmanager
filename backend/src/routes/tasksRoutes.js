const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Task = require('../models/Task');

const router = express.Router();

// Manejo de errores
const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/tasks
router.post(
  '/',
  body('title').notEmpty().withMessage('El campo title es obligatorio'),
  handleErrors,
  async (req, res) => {
    try {
      const { title, description, completed } = req.body;
      const task = await Task.create({ title, description, completed });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la tarea' });
    }
  }
);

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const { completed } = req.query;
    const filter = completed ? { completed: completed === 'true' } : {};
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// GET /api/tasks/:id
router.get(
  '/:id',
  param('id').isMongoId().withMessage('ID inválido'),
  handleErrors,
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la tarea' });
    }
  }
);

// PUT /api/tasks/:id
router.put(
  '/:id',
  param('id').isMongoId().withMessage('ID inválido'),
  handleErrors,
  async (req, res) => {
    try {
      const updates = req.body;  // Esto tomará todos los campos enviados en el body
      const task = await Task.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });

      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }

      res.json(task);  // Retorna la tarea actualizada
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
  }
);

// DELETE /api/tasks/:id
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('ID inválido'),
  handleErrors,
  async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      res.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
  }
);

module.exports = router;
