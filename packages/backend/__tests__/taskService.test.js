const Database = require('better-sqlite3');

// Mock the database module before requiring taskService
jest.mock('../src/database', () => {
  const Database = require('better-sqlite3');
  const mockTestDb = new Database(':memory:');
  
  mockTestDb.exec(`
    CREATE TABLE tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  return {
    db: mockTestDb,
  };
});

// Now require taskService - it will use our mocked database
const taskService = require('../src/services/taskService');
const { db } = require('../src/database');

beforeEach(() => {
  // Clear tasks before each test
  db.prepare('DELETE FROM tasks').run();
});

afterAll(() => {
  db.close();
});

describe('TaskService - Validation', () => {
  describe('validateTitle', () => {
    it('should accept valid title', () => {
      expect(taskService.validateTitle('Valid Task')).toBe('Valid Task');
    });

    it('should trim whitespace', () => {
      expect(taskService.validateTitle('  Trimmed Task  ')).toBe('Trimmed Task');
    });

    it('should throw error for empty title', () => {
      expect(() => taskService.validateTitle('')).toThrow('Title cannot be empty');
    });

    it('should throw error for title over 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      expect(() => taskService.validateTitle(longTitle)).toThrow('Title must be 100 characters or less');
    });
  });

  describe('validatePriority', () => {
    it('should accept valid priorities', () => {
      expect(taskService.validatePriority('low')).toBe('low');
      expect(taskService.validatePriority('medium')).toBe('medium');
      expect(taskService.validatePriority('high')).toBe('high');
    });

    it('should default to medium if not provided', () => {
      expect(taskService.validatePriority()).toBe('medium');
      expect(taskService.validatePriority(null)).toBe('medium');
    });

    it('should normalize case', () => {
      expect(taskService.validatePriority('HIGH')).toBe('high');
      expect(taskService.validatePriority('Low')).toBe('low');
    });

    it('should throw error for invalid priority', () => {
      expect(() => taskService.validatePriority('urgent')).toThrow('Priority must be low, medium, or high');
    });
  });

  describe('validateDueDate', () => {
    it('should accept valid date string', () => {
      const date = taskService.validateDueDate('2026-12-31');
      expect(date).toMatch(/2026-12-31/);
    });

    it('should return null for empty date', () => {
      expect(taskService.validateDueDate('')).toBeNull();
      expect(taskService.validateDueDate(null)).toBeNull();
    });

    it('should throw error for invalid date', () => {
      expect(() => taskService.validateDueDate('invalid-date')).toThrow('Invalid due date format');
    });
  });
});

describe('TaskService - CRUD Operations', () => {
  describe('createTask', () => {
    it('should create task with valid data', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        due_date: '2026-12-31',
        priority: 'high',
      };

      const task = taskService.createTask(taskData);

      expect(task).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        completed: 0,
      });
      expect(task.id).toBeDefined();
      expect(task.due_date).toMatch(/2026-12-31/);
    });

    it('should create task with minimal data', () => {
      const task = taskService.createTask({ title: 'Minimal Task' });

      expect(task.title).toBe('Minimal Task');
      expect(task.priority).toBe('medium');
      expect(task.completed).toBe(0);
      expect(task.description).toBeNull();
    });

    it('should throw error for missing title', () => {
      expect(() => taskService.createTask({})).toThrow('Title is required');
    });
  });

  describe('getAllTasks', () => {
    beforeEach(() => {
      // Create sample tasks
      taskService.createTask({ title: 'Task 1', priority: 'high', completed: false });
      taskService.createTask({ title: 'Task 2', priority: 'low', completed: true });
      taskService.createTask({ title: 'Task 3', priority: 'medium', completed: false });
    });

    it('should return all tasks', () => {
      const tasks = taskService.getAllTasks();
      expect(tasks).toHaveLength(3);
    });

    it('should filter by active status', () => {
      const tasks = taskService.getAllTasks({ status: 'active' });
      expect(tasks).toHaveLength(2);
      expect(tasks.every((t) => t.completed === 0)).toBe(true);
    });

    it('should filter by completed status', () => {
      const tasks = taskService.getAllTasks({ status: 'completed' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].completed).toBe(1);
    });

    it('should filter by priority', () => {
      const tasks = taskService.getAllTasks({ priority: 'high' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].priority).toBe('high');
    });

    it('should search by title', () => {
      const tasks = taskService.getAllTasks({ search: 'Task 1' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Task 1');
    });

    it('should sort by priority', () => {
      const tasks = taskService.getAllTasks({ sortBy: 'priority', sortOrder: 'ASC' });
      expect(tasks[0].priority).toBe('high');
      expect(tasks[2].priority).toBe('low');
    });
  });

  describe('getTaskById', () => {
    it('should return task by ID', () => {
      const created = taskService.createTask({ title: 'Find Me' });
      const found = taskService.getTaskById(created.id);
      expect(found.title).toBe('Find Me');
    });

    it('should throw error for non-existent task', () => {
      expect(() => taskService.getTaskById(9999)).toThrow('Task not found');
    });
  });

  describe('updateTask', () => {
    let taskId;

    beforeEach(() => {
      const task = taskService.createTask({
        title: 'Original Title',
        description: 'Original Description',
        priority: 'low',
      });
      taskId = task.id;
    });

    it('should update task title', () => {
      const updated = taskService.updateTask(taskId, { title: 'Updated Title' });
      expect(updated.title).toBe('Updated Title');
      expect(updated.description).toBe('Original Description');
    });

    it('should update multiple fields', () => {
      const updated = taskService.updateTask(taskId, {
        title: 'New Title',
        priority: 'high',
        completed: true,
      });
      expect(updated.title).toBe('New Title');
      expect(updated.priority).toBe('high');
      expect(updated.completed).toBe(1);
    });

    it('should throw error for non-existent task', () => {
      expect(() => taskService.updateTask(9999, { title: 'Test' })).toThrow('Task not found');
    });
  });

  describe('toggleTaskCompletion', () => {
    it('should toggle completion status', () => {
      const task = taskService.createTask({ title: 'Toggle Me' });
      expect(task.completed).toBe(0);

      const toggled = taskService.toggleTaskCompletion(task.id);
      expect(toggled.completed).toBe(1);

      const toggledAgain = taskService.toggleTaskCompletion(task.id);
      expect(toggledAgain.completed).toBe(0);
    });
  });

  describe('deleteTask', () => {
    it('should delete task', () => {
      const task = taskService.createTask({ title: 'Delete Me' });
      const deleted = taskService.deleteTask(task.id);

      expect(deleted.id).toBe(task.id);
      expect(() => taskService.getTaskById(task.id)).toThrow('Task not found');
    });

    it('should throw error for non-existent task', () => {
      expect(() => taskService.deleteTask(9999)).toThrow('Task not found');
    });
  });
});
