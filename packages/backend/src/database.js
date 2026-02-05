const Database = require('better-sqlite3');

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tasks table
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
  CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
  CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
`);

// Insert initial sample data
const sampleTasks = [
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the TODO app',
    due_date: '2026-02-15',
    priority: 'high',
    completed: 0,
  },
  {
    title: 'Review pull requests',
    description: 'Review and approve pending PRs',
    due_date: '2026-02-10',
    priority: 'medium',
    completed: 0,
  },
  {
    title: 'Update dependencies',
    description: 'Update npm packages to latest versions',
    due_date: null,
    priority: 'low',
    completed: 1,
  },
  {
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing',
    due_date: '2026-02-20',
    priority: 'high',
    completed: 0,
  },
];

const insertStmt = db.prepare(`
  INSERT INTO tasks (title, description, due_date, priority, completed)
  VALUES (?, ?, ?, ?, ?)
`);

sampleTasks.forEach((task) => {
  insertStmt.run(
    task.title,
    task.description,
    task.due_date,
    task.priority,
    task.completed
  );
});

console.log('In-memory database initialized with sample tasks');

module.exports = { db };
