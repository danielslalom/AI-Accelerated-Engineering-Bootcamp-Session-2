# Coding Guidelines

## Overview

This document establishes the coding style and quality principles for the TODO application. Consistent, clean, and maintainable code is essential for long-term project success. These guidelines ensure that all contributors write code that is readable, efficient, and easy to maintain.

## Philosophy

Our coding philosophy is built on three core principles: **clarity**, **consistency**, and **quality**. Code should be self-documenting and easy to understand. We value simplicity over cleverness, and we believe that well-structured code with clear intent is more valuable than terse, complex solutions.

## Code Formatting

### General Formatting Rules

All code in this project follows consistent formatting standards to ensure readability and reduce cognitive load when reviewing code. We use automated formatters to enforce these standards, removing subjective style debates from code reviews.

**Indentation**: Use 2 spaces for indentation in JavaScript, JSX, JSON, and CSS files. Never use tabs. This ensures consistent rendering across different editors and reduces file size.

**Line Length**: Limit lines to 100 characters maximum. This improves readability and makes it easier to view code side-by-side or on smaller screens. Break long lines at natural boundaries—after operators, commas, or before method chains.

**Semicolons**: Always use semicolons to terminate statements. While JavaScript's automatic semicolon insertion can handle many cases, explicit semicolons prevent subtle bugs and make code intent clear.

**Quotes**: Use single quotes for strings in JavaScript files, except when writing JSX where double quotes are preferred for attributes. Template literals (backticks) should be used when string interpolation is needed.

```javascript
// Good
const message = 'Hello, world!';
const name = `User ${userId}`;
const element = <Button label="Click me" />;

// Avoid
const message = "Hello, world!";
const name = 'User ' + userId;
```

**Trailing Commas**: Always include trailing commas in multi-line object and array literals. This makes git diffs cleaner when adding new items and prevents errors when reordering items.

```javascript
const task = {
  title: 'Complete project',
  dueDate: '2026-12-31',
  priority: 'high',
};
```

### Whitespace and Spacing

Proper use of whitespace improves code readability. Add spaces around operators, after commas, and before opening braces. However, don't add spaces inside parentheses, brackets, or before function call parentheses.

```javascript
// Good
function createTask(title, dueData) {
  const task = { title, dueDate, completed: false };
  return taskService.save(task);
}

// Avoid
function createTask( title,dueDate ){
  const task={title,dueDate,completed:false};
  return taskService.save (task);
}
```

Use blank lines to separate logical sections within functions and to separate function declarations. This creates visual breathing room and helps readers parse the code structure.

## Import Organization

Organized imports make it easy to understand a file's dependencies at a glance. All imports should be grouped logically at the top of the file, never scattered throughout the code.

### Import Order

Imports should be organized in the following order, with a blank line separating each group:

1. **External libraries** (third-party packages from node_modules)
2. **Internal modules** (project modules using absolute or relative paths)
3. **Components** (React components)
4. **Utilities and helpers**
5. **Constants and types**
6. **Styles** (CSS imports should be last)

Within each group, imports should be alphabetically sorted. This makes it easy to find specific imports and prevents duplicate imports.

```javascript
// External libraries
import React, { useState, useEffect } from 'react';
import { Button, Card, TextField } from '@mui/material';
import axios from 'axios';

// Internal modules
import taskService from '../services/taskService';
import { useAuth } from '../hooks/useAuth';

// Components
import TaskItem from './TaskItem';
import TaskList from './TaskList';

// Utilities
import { formatDate, validateTask } from '../utils/helpers';

// Constants
import { API_BASE_URL, TASK_STATUS } from '../constants';

// Styles
import './App.css';
```

### Named vs Default Imports

Prefer named imports over default imports when a module exports multiple items. Named imports make refactoring easier and provide better IDE support. However, use default imports for React components and modules that export a single primary item.

```javascript
// Preferred named imports
import { createTask, updateTask, deleteTask } from '../services/taskService';

// Default imports for components
import TaskList from './TaskList';
```

### Import Path Organization

Use absolute imports for modules that are far from the current file (e.g., `import { Button } from '@mui/material'`). For nearby files, relative imports are acceptable but should be kept to a maximum of two levels up (e.g., `../../utils/helpers`). If you need to go deeper, consider using absolute import paths configured in your build tool.

## Linter Configuration and Usage

### ESLint

We use ESLint to enforce code quality and catch potential bugs before they reach production. ESLint is configured with rules that align with our coding standards and React best practices.

**Running the Linter**: Always run ESLint before committing code. The linter runs automatically in your editor (if configured) and in the CI/CD pipeline. Fix all linting errors and warnings—don't disable rules or use `eslint-disable` comments without a compelling reason documented in a comment.

```bash
# Run ESLint on all files
npm run lint

# Auto-fix issues where possible
npm run lint:fix
```

**Configuration**: Our ESLint configuration extends recommended rules from `eslint:recommended` and `plugin:react/recommended`. We've customized certain rules to match our preferences, such as requiring trailing commas and enforcing consistent quotes.

### Prettier

Prettier handles code formatting automatically, ensuring consistent style across the entire codebase. Prettier runs on save (if configured in your editor) and as a pre-commit hook.

The combination of ESLint and Prettier ensures both code quality (ESLint) and consistent formatting (Prettier). The two tools are configured to work together without conflicts through `eslint-config-prettier`.

**Editor Integration**: Configure your editor to format on save using Prettier. This eliminates manual formatting work and ensures all code is consistently styled.

## Naming Conventions

Clear, descriptive names make code self-documenting. We follow JavaScript community standards for naming conventions.

### Variables and Functions

Use `camelCase` for variables, functions, and methods. Names should be descriptive and convey the purpose or content. Avoid abbreviations unless they're widely understood (e.g., `id`, `url`).

```javascript
// Good
const taskList = [];
const completedTaskCount = 0;
function fetchTasksFromServer() { }

// Avoid
const tl = [];
const cnt = 0;
function getTasks() { } // Too generic
```

### Boolean Variables

Prefix boolean variables with words like `is`, `has`, `can`, or `should` to make their type obvious.

```javascript
const isCompleted = false;
const hasDeadline = true;
const canEdit = user.permissions.includes('edit');
const shouldShowWarning = dueDate < today;
```

### Constants

Use `UPPER_SNAKE_CASE` for constants, especially those defined at module level. This makes them easily distinguishable from variables.

```javascript
const API_BASE_URL = 'https://api.example.com';
const MAX_TASK_TITLE_LENGTH = 100;
const DEFAULT_PRIORITY = 'medium';
```

### React Components

Use `PascalCase` for React component names and their file names. Component file names should match the component name exactly.

```javascript
// TaskList.js
function TaskList({ tasks }) {
  return <div>{/* ... */}</div>;
}

export default TaskList;
```

### Event Handlers

Prefix event handler functions with `handle` and name them after the action they perform.

```javascript
function handleTaskClick(taskId) { }
function handleFormSubmit(event) { }
function handleDeleteConfirm() { }
```

## Code Quality Principles

### DRY: Don't Repeat Yourself

Duplication is one of the most common sources of bugs and maintenance burden. When you find yourself writing similar code in multiple places, extract it into a reusable function or component.

**Extract Common Logic**: If the same logic appears more than twice, create a utility function. This ensures that fixes and improvements only need to be made in one place.

```javascript
// Before: Duplicated logic
const task1Date = new Date(task1.dueDate).toLocaleDateString();
const task2Date = new Date(task2.dueDate).toLocaleDateString();
const task3Date = new Date(task3.dueDate).toLocaleDateString();

// After: Extracted utility function
function formatTaskDate(task) {
  return new Date(task.dueDate).toLocaleDateString();
}

const task1Date = formatTaskDate(task1);
const task2Date = formatTaskDate(task2);
const task3Date = formatTaskDate(task3);
```

**Component Reusability**: In React, extract common UI patterns into reusable components. Parameterize differences through props rather than duplicating component code.

### KISS: Keep It Simple, Stupid

Simplicity should be a key goal in design. Simple code is easier to understand, test, and maintain. Avoid over-engineering and premature optimization.

Write code for humans first, computers second. If a solution requires extensive comments to explain, it's probably too complex. Consider refactoring into smaller, self-explanatory pieces.

```javascript
// Overly complex
const isTaskEligible = (task) => {
  return task.status === 'active' && 
         (!task.dueDate || new Date(task.dueDate) > new Date()) &&
         (task.assignee === currentUser || task.assignee === null);
};

// Simpler with extracted functions
const isActive = (task) => task.status === 'active';
const isNotOverdue = (task) => !task.dueDate || new Date(task.dueDate) > new Date();
const isAssignedToCurrentUser = (task) => task.assignee === currentUser || task.assignee === null;

const isTaskEligible = (task) => {
  return isActive(task) && isNotOverdue(task) && isAssignedToCurrentUser(task);
};
```

### YAGNI: You Aren't Gonna Need It

Don't add functionality until it's actually needed. Speculative features add complexity without immediate value and may never be used. Build what's required now, and add features when they're actually requested.

This principle applies to both features and code structure. Don't create elaborate abstractions for problems you haven't encountered yet.

### Single Responsibility Principle

Each function and component should do one thing well. If a function has multiple responsibilities, split it into separate functions. If a component handles multiple concerns, consider breaking it into smaller components.

```javascript
// Too many responsibilities
function TaskManager() {
  // Fetches data
  // Handles form state
  // Manages sorting and filtering
  // Renders UI
  // All in one component
}

// Better: Split responsibilities
function TaskList() { /* Renders data */ }
function TaskForm() { /* Handles form */ }
function useTaskData() { /* Custom hook for data */ }
function useTaskFilters() { /* Custom hook for filters */ }
```

### Meaningful Function Length

Functions should be short and focused. As a guideline, if a function is longer than 20-30 lines, consider whether it can be broken into smaller functions. Short functions are easier to test, understand, and reuse.

### Error Handling

Handle errors gracefully and provide meaningful error messages. Never use empty catch blocks. Always log errors or show them to the user when appropriate.

```javascript
// Good error handling
async function fetchTasks() {
  try {
    const response = await axios.get('/api/tasks');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw new Error('Unable to load tasks. Please try again.');
  }
}

// Poor error handling
async function fetchTasks() {
  try {
    return (await axios.get('/api/tasks')).data;
  } catch (error) {
    // Silent failure - bad!
  }
}
```

## React-Specific Guidelines

### Functional Components

Use functional components with hooks rather than class components. Functional components are simpler, require less boilerplate, and integrate better with modern React patterns.

### Hooks Rules

Follow the Rules of Hooks: only call hooks at the top level of your component (never inside conditions or loops), and only call hooks from React functions.

### Component Structure

Structure your component files consistently:
1. Imports
2. Component definition
3. Styled components or internal helpers (if any)
4. PropTypes or TypeScript types
5. Export statement

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

// 2. Component
function TaskItem({ task, onComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Component logic
  
  return (
    // JSX
  );
}

// 3. PropTypes (if using)
TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};

// 4. Export
export default TaskItem;
```

### State Management

Keep state as close as possible to where it's used. Lift state up only when multiple components need to share it. Consider using Context API for truly global state, but avoid overuse.

## Comments and Documentation

### When to Comment

Code should be self-explanatory through good naming and structure. Comments should explain **why** something is done, not **what** is being done. The code itself should make the "what" clear.

```javascript
// Bad: Comment states the obvious
// Set completed to true
task.completed = true;

// Good: Comment explains reasoning
// Mark as completed immediately to prevent duplicate submissions
// while the API request is in flight
task.completed = true;
```

### JSDoc for Functions

Use JSDoc comments for complex functions, especially those in utility modules or services. This provides better IDE support and makes intent clear.

```javascript
/**
 * Filters tasks by status and due date range
 * @param {Array} tasks - Array of task objects
 * @param {string} status - Filter status: 'all', 'active', or 'completed'
 * @param {Date} startDate - Start of date range (optional)
 * @param {Date} endDate - End of date range (optional)
 * @returns {Array} Filtered tasks
 */
function filterTasks(tasks, status, startDate, endDate) {
  // Implementation
}
```

### TODO Comments

Use TODO comments sparingly and always include context and an owner identifier if possible.

```javascript
// TODO(username): Implement caching to improve performance
// TODO: Add validation for date format (refer to ticket #123)
```

## File Organization

### Directory Structure

Organize files by feature or domain, not by type. Group related components, styles, and tests together rather than having separate directories for all components, all styles, etc.

```
src/
  components/
    TaskList/
      TaskList.js
      TaskList.test.js
      TaskList.css
    TaskItem/
      TaskItem.js
      TaskItem.test.js
  services/
    taskService.js
    taskService.test.js
  utils/
    dateHelpers.js
    dateHelpers.test.js
```

### File Size

Keep files focused and reasonably sized. If a file exceeds 300-400 lines, consider splitting it into multiple files or extracting components.

## Performance Best Practices

### Avoid Premature Optimization

Write clear, correct code first. Optimize only when you have evidence of performance problems. "Premature optimization is the root of all evil" (Donald Knuth).

### Memoization

Use React's `useMemo` and `useCallback` hooks judiciously. Only memoize expensive computations or callbacks passed to optimized child components. Overuse adds complexity without benefit.

### Key Props

Always provide stable, unique keys for lists in React. Never use array indices as keys if the list can be reordered or filtered.

```javascript
// Good: Stable, unique key
{tasks.map(task => (
  <TaskItem key={task.id} task={task} />
))}

// Bad: Using index
{tasks.map((task, index) => (
  <TaskItem key={index} task={task} />
))}
```

## Version Control Practices

### Commit Messages

Write clear, descriptive commit messages. Use the imperative mood ("Add feature" not "Added feature"). Include context about why the change was made if it's not obvious.

```
Good commit message format:
Add due date filtering to task list

- Implement date range filter in TaskList component
- Add date picker UI controls
- Update tests to cover new filtering logic
```

### Atomic Commits

Make small, focused commits that address a single concern. This makes code review easier and simplifies reverting changes if needed.

## Testing Requirements

All production code must include tests as outlined in our Testing Guidelines. Write testable code by keeping functions pure where possible and minimizing side effects.

## Continuous Improvement

These guidelines are living documents. As we learn and the project evolves, we'll update these standards. Suggest improvements through pull requests with clear rationale for proposed changes.

## Summary

Quality code is characterized by clarity, consistency, and maintainability. Follow these guidelines, use the automated tools we've configured, and always ask yourself: "Will another developer (or future me) understand this code six months from now?" If the answer is no, refactor until it's yes.
