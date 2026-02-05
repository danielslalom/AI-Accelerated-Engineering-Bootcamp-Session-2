const request = require('supertest');
const { app, db } = require('../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('Task API Endpoints', () => {
  let createdTaskId;

  describe('POST /api/tasks', () => {
    it('should create a new task with complete data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        due_date: '2026-12-31',
        priority: 'high',
      };

      const response = await request(app).post('/api/tasks').send(taskData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        completed: 0,
      });
      expect(response.body.id).toBeDefined();

      createdTaskId = response.body.id;
    });

    it('should create task with minimal data', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Minimal Task' });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Minimal Task');
      expect(response.body.priority).toBe('medium');
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', priority: 'urgent' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Priority');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create sample tasks
      await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 1', priority: 'high', completed: false });
      await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 2', priority: 'low', completed: true });
    });

    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app).get('/api/tasks?status=active');

      expect(response.status).toBe(200);
      expect(response.body.every((task) => task.completed === 0)).toBe(true);
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app).get('/api/tasks?priority=high');

      expect(response.status).toBe(200);
      expect(response.body.every((task) => task.priority === 'high')).toBe(true);
    });

    it('should search tasks', async () => {
      const response = await request(app).get('/api/tasks?search=Task 1');

      expect(response.status).toBe(200);
      expect(response.body.some((task) => task.title.includes('Task 1'))).toBe(true);
    });

    it('should sort tasks', async () => {
      const response = await request(app).get('/api/tasks?sortBy=priority&sortOrder=ASC');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a specific task', async () => {
      const created = await request(app)
        .post('/api/tasks')
        .send({ title: 'Specific Task' });

      const response = await request(app).get(`/api/tasks/${created.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Specific Task');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).get('/api/tasks/99999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original Task', priority: 'low' });
      taskId = response.body.id;
    });

    it('should update task fields', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'Updated Task', priority: 'high' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Task');
      expect(response.body.priority).toBe('high');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/99999')
        .send({ title: 'Test' });

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ priority: 'invalid' });

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    let taskId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Toggle Task' });
      taskId = response.body.id;
    });

    it('should toggle task completion', async () => {
      const response = await request(app).patch(`/api/tasks/${taskId}/complete`);

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(1);

      const toggleAgain = await request(app).patch(`/api/tasks/${taskId}/complete`);
      expect(toggleAgain.body.completed).toBe(0);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).patch('/api/tasks/99999/complete');

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const created = await request(app)
        .post('/api/tasks')
        .send({ title: 'Delete Me' });

      const response = await request(app).delete(`/api/tasks/${created.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');

      const getResponse = await request(app).get(`/api/tasks/${created.body.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).delete('/api/tasks/99999');

      expect(response.status).toBe(404);
    });
  });
});
