const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { db } = require('./database');
const taskService = require('./services/taskService');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TODO App API Server',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks',
      health: '/api/health',
    },
    docs: 'Access the frontend at port 3000',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all tasks with optional filters
app.get('/api/tasks', (req, res) => {
  try {
    const { status, priority, search, sortBy, sortOrder } = req.query;
    const tasks = taskService.getAllTasks({
      status,
      priority,
      search,
      sortBy,
      sortOrder,
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get a single task by ID
app.get('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const task = taskService.getTaskById(parseInt(id));
    res.json(task);
  } catch (error) {
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  try {
    const task = taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update an existing task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const task = taskService.updateTask(parseInt(id), req.body);
    res.json(task);
  } catch (error) {
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error updating task:', error);
    res.status(400).json({ error: error.message });
  }
});

// Toggle task completion status
app.patch('/api/tasks/:id/complete', (req, res) => {
  try {
    const { id } = req.params;
    const task = taskService.toggleTaskCompletion(parseInt(id));
    res.json(task);
  } catch (error) {
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error toggling task completion:', error);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = taskService.deleteTask(parseInt(id));
    res.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db };