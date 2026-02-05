const { db } = require('../database');

// Validation functions
const validateTitle = (title) => {
  if (!title || typeof title !== 'string') {
    throw new Error('Title is required');
  }
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    throw new Error('Title cannot be empty');
  }
  if (trimmed.length > 100) {
    throw new Error('Title must be 100 characters or less');
  }
  return trimmed;
};

const validateDescription = (description) => {
  if (description === null || description === undefined) {
    return null;
  }
  if (typeof description !== 'string') {
    throw new Error('Description must be a string');
  }
  if (description.length > 500) {
    throw new Error('Description must be 500 characters or less');
  }
  return description.trim() || null;
};

const validateDueDate = (dueDate) => {
  if (!dueDate) {
    return null;
  }
  const date = new Date(dueDate);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid due date format');
  }
  return date.toISOString();
};

const validatePriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high'];
  if (!priority) {
    return 'medium';
  }
  const normalized = priority.toLowerCase();
  if (!validPriorities.includes(normalized)) {
    throw new Error('Priority must be low, medium, or high');
  }
  return normalized;
};

const validateCompleted = (completed) => {
  if (completed === undefined || completed === null) {
    return false;
  }
  return Boolean(completed);
};

// Task operations
const getAllTasks = (filters = {}) => {
  const { status, priority, search, sortBy = 'created_at', sortOrder = 'DESC' } = filters;
  
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];
  
  // Apply filters
  if (status === 'active') {
    query += ' AND completed = 0';
  } else if (status === 'completed') {
    query += ' AND completed = 1';
  }
  
  if (priority && ['low', 'medium', 'high'].includes(priority)) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  
  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  // Apply sorting
  const validSortColumns = ['created_at', 'updated_at', 'due_date', 'priority', 'completed', 'title'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  
  // Handle null due_dates in sorting
  if (sortColumn === 'due_date') {
    query += ` ORDER BY ${sortColumn} IS NULL, ${sortColumn} ${order}`;
  } else if (sortColumn === 'priority') {
    // Sort by priority: high, medium, low
    query += ` ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END ${order}`;
  } else {
    query += ` ORDER BY ${sortColumn} ${order}`;
  }
  
  return db.prepare(query).all(...params);
};

const getTaskById = (id) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
};

const createTask = (taskData) => {
  const title = validateTitle(taskData.title);
  const description = validateDescription(taskData.description);
  const dueDate = validateDueDate(taskData.due_date || taskData.dueDate);
  const priority = validatePriority(taskData.priority);
  const completed = validateCompleted(taskData.completed);
  
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, due_date, priority, completed)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(title, description, dueDate, priority, completed ? 1 : 0);
  return getTaskById(result.lastInsertRowid);
};

const updateTask = (id, taskData) => {
  // Check if task exists
  getTaskById(id);
  
  const updates = [];
  const params = [];
  
  if (taskData.title !== undefined) {
    updates.push('title = ?');
    params.push(validateTitle(taskData.title));
  }
  
  if (taskData.description !== undefined) {
    updates.push('description = ?');
    params.push(validateDescription(taskData.description));
  }
  
  if (taskData.due_date !== undefined || taskData.dueDate !== undefined) {
    updates.push('due_date = ?');
    params.push(validateDueDate(taskData.due_date || taskData.dueDate));
  }
  
  if (taskData.priority !== undefined) {
    updates.push('priority = ?');
    params.push(validatePriority(taskData.priority));
  }
  
  if (taskData.completed !== undefined) {
    updates.push('completed = ?');
    params.push(validateCompleted(taskData.completed) ? 1 : 0);
  }
  
  if (updates.length === 0) {
    return getTaskById(id);
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);
  
  const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
  db.prepare(query).run(...params);
  
  return getTaskById(id);
};

const toggleTaskCompletion = (id) => {
  const task = getTaskById(id);
  const newCompleted = !task.completed;
  
  db.prepare('UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(newCompleted ? 1 : 0, id);
  
  return getTaskById(id);
};

const deleteTask = (id) => {
  // Check if task exists
  const task = getTaskById(id);
  
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  
  if (result.changes === 0) {
    throw new Error('Failed to delete task');
  }
  
  return task;
};

module.exports = {
  validateTitle,
  validateDescription,
  validateDueDate,
  validatePriority,
  validateCompleted,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
};
