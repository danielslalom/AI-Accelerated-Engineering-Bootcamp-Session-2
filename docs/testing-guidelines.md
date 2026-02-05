# Testing Guidelines

## Overview
This document outlines the testing standards and requirements for the TODO application. Comprehensive testing ensures code quality, prevents regressions, and enables confident refactoring and feature development.

## Testing Philosophy

### Core Testing Principles

1. **Comprehensive Coverage**: The application must include unit tests, integration tests, and end-to-end tests
2. **Test-Driven Development**: Write tests alongside or before implementation when possible
3. **All Features Require Tests**: Every new feature must include appropriate tests at multiple levels
4. **Maintainability First**: Tests should be clear, concise, and easy to maintain
5. **Fast Feedback**: Tests should run quickly to encourage frequent execution
6. **Reliability**: Tests should be deterministic and not flaky

## Testing Pyramid

### Unit Tests (Base - 70%)
- **Purpose**: Test individual functions, components, and modules in isolation
- **Scope**: Single unit of code (function, method, component)
- **Speed**: Very fast (milliseconds)
- **Required**: Every utility function, service method, and React component

### Integration Tests (Middle - 20%)
- **Purpose**: Test interactions between multiple units
- **Scope**: Multiple components/modules working together
- **Speed**: Fast (seconds)
- **Required**: API endpoints, component interactions, service integrations

### End-to-End Tests (Top - 10%)
- **Purpose**: Test complete user workflows from UI to database
- **Scope**: Full application stack
- **Speed**: Slower (seconds to minutes)
- **Required**: Critical user paths and workflows

## Technology Stack

### Frontend Testing
- **Test Runner**: Jest
- **Component Testing**: React Testing Library
- **E2E Testing**: Cypress or Playwright
- **Mocking**: Jest mocks, MSW (Mock Service Worker)
- **Coverage**: Jest coverage reports

### Backend Testing
- **Test Runner**: Jest
- **HTTP Testing**: Supertest
- **Database Testing**: In-memory database or test database
- **Mocking**: Jest mocks
- **Coverage**: Jest coverage reports

## Unit Testing Guidelines

### What to Unit Test

#### Frontend
- React component rendering
- Component props and state behavior
- Event handlers and user interactions
- Utility functions and helpers
- Custom hooks
- State management logic (reducers, selectors)

#### Backend
- Service layer functions
- Data validation logic
- Business logic
- Utility functions
- Middleware

### Unit Test Best Practices

1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **One Assertion Per Test**: Focus each test on a single behavior
3. **Descriptive Test Names**: Use clear, behavior-focused descriptions
4. **Avoid Implementation Details**: Test behavior, not implementation
5. **Mock External Dependencies**: Isolate the unit under test
6. **Keep Tests Simple**: Tests should be easier to understand than the code they test

### Unit Test Example (Frontend)
```javascript
describe('TaskItem Component', () => {
  it('should display task title', () => {
    // Arrange
    const task = { id: 1, title: 'Test Task', completed: false };
    
    // Act
    render(<TaskItem task={task} />);
    
    // Assert
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should call onToggle when checkbox is clicked', () => {
    // Arrange
    const task = { id: 1, title: 'Test Task', completed: false };
    const onToggle = jest.fn();
    
    // Act
    render(<TaskItem task={task} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('checkbox'));
    
    // Assert
    expect(onToggle).toHaveBeenCalledWith(1);
  });
});
```

### Unit Test Example (Backend)
```javascript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task with valid data', async () => {
      // Arrange
      const taskData = { title: 'New Task', description: 'Test' };
      
      // Act
      const result = await taskService.createTask(taskData);
      
      // Assert
      expect(result).toMatchObject({
        title: 'New Task',
        description: 'Test',
        completed: false
      });
      expect(result.id).toBeDefined();
    });

    it('should throw error for empty title', async () => {
      // Arrange
      const taskData = { title: '', description: 'Test' };
      
      // Act & Assert
      await expect(taskService.createTask(taskData))
        .rejects.toThrow('Title is required');
    });
  });
});
```

## Integration Testing Guidelines

### What to Integration Test

#### Frontend
- Multiple components working together
- API calls and data fetching
- Form submissions with validation
- Navigation and routing
- State management across components

#### Backend
- API endpoint functionality
- Request/response handling
- Database operations
- Authentication and authorization
- Error handling and middleware

### Integration Test Best Practices

1. **Test Realistic Scenarios**: Use real data structures and flows
2. **Minimize Mocking**: Mock only external services (APIs, databases)
3. **Test Error Paths**: Include both success and failure scenarios
4. **Use Test Fixtures**: Create reusable test data
5. **Clean Up**: Reset database/state between tests

### Integration Test Example (Frontend)
```javascript
describe('TaskList Integration', () => {
  it('should fetch and display tasks on mount', async () => {
    // Arrange
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true }
    ];
    
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.json(mockTasks));
      })
    );
    
    // Act
    render(<TaskList />);
    
    // Assert
    expect(await screen.findByText('Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Task 2')).toBeInTheDocument();
  });
});
```

### Integration Test Example (Backend)
```javascript
describe('Task API Endpoints', () => {
  describe('POST /api/tasks', () => {
    it('should create a new task and return 201', async () => {
      // Arrange
      const taskData = {
        title: 'New Task',
        description: 'Test Description'
      };
      
      // Act
      const response = await request(app)
        .post('/api/tasks')
        .send(taskData);
      
      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(taskData);
      expect(response.body.id).toBeDefined();
      expect(response.body.completed).toBe(false);
    });

    it('should return 400 for invalid data', async () => {
      // Arrange
      const invalidData = { description: 'No title' };
      
      // Act
      const response = await request(app)
        .post('/api/tasks')
        .send(invalidData);
      
      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});
```

## End-to-End Testing Guidelines

### What to E2E Test

- Complete user workflows
- Critical business paths
- Cross-browser compatibility
- Authentication flows
- Data persistence
- Error recovery

### E2E Test Scenarios for TODO App

1. **Create Task Flow**: User adds a new task and sees it in the list
2. **Complete Task Flow**: User marks a task as complete and sees visual feedback
3. **Edit Task Flow**: User edits task details and changes persist
4. **Delete Task Flow**: User deletes a task and it's removed from the list
5. **Filter Tasks Flow**: User filters tasks by status and sees correct results
6. **Search Tasks Flow**: User searches for tasks and finds matches

### E2E Test Best Practices

1. **Test User Journeys**: Focus on complete workflows, not individual features
2. **Use Page Object Pattern**: Encapsulate page interactions in page objects
3. **Avoid Test Interdependence**: Each test should be independent
4. **Use Data-Testid**: Add test IDs to important elements
5. **Minimize Brittleness**: Avoid testing implementation details
6. **Take Screenshots on Failure**: Capture state for debugging

### E2E Test Example (Cypress)
```javascript
describe('Task Management Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete full task lifecycle', () => {
    // Create task
    cy.get('[data-testid="new-task-input"]').type('Buy groceries');
    cy.get('[data-testid="add-task-button"]').click();
    
    // Verify task appears
    cy.contains('Buy groceries').should('be.visible');
    
    // Mark complete
    cy.get('[data-testid="task-checkbox-1"]').click();
    cy.get('[data-testid="task-1"]').should('have.class', 'completed');
    
    // Edit task
    cy.get('[data-testid="edit-task-1"]').click();
    cy.get('[data-testid="task-title-input"]').clear().type('Buy milk');
    cy.get('[data-testid="save-task-button"]').click();
    cy.contains('Buy milk').should('be.visible');
    
    // Delete task
    cy.get('[data-testid="delete-task-1"]').click();
    cy.get('[data-testid="confirm-delete"]').click();
    cy.contains('Buy milk').should('not.exist');
  });
});
```

## Test Maintainability

### Writing Maintainable Tests

1. **Clear Test Names**: Use descriptive names that explain what is being tested
   - Good: `should display error message when title is empty`
   - Bad: `test1` or `it works`

2. **DRY Principle**: Extract common setup into `beforeEach` or helper functions
   - Create test utilities and fixtures
   - Reuse test data setup

3. **Avoid Magic Values**: Use constants for test data
   ```javascript
   const VALID_TASK_TITLE = 'Test Task';
   const INVALID_TASK_TITLE = '';
   ```

4. **Single Responsibility**: Each test should verify one behavior
   - Split complex tests into multiple smaller tests
   - Each test should have one reason to fail

5. **Minimal Mocking**: Only mock what is necessary
   - Over-mocking makes tests brittle
   - Prefer real implementations when fast enough

6. **Descriptive Assertions**: Use specific matchers
   ```javascript
   // Good
   expect(task.title).toBe('Test Task');
   
   // Bad
   expect(task).toBeTruthy();
   ```

7. **Test Organization**: Group related tests with `describe` blocks
   ```javascript
   describe('TaskService', () => {
     describe('createTask', () => {
       // Tests for createTask
     });
     
     describe('updateTask', () => {
       // Tests for updateTask
     });
   });
   ```

### Test Code Quality

- **Readability**: Tests should be easy to read and understand
- **Consistency**: Follow consistent patterns across all tests
- **Documentation**: Add comments only when necessary to explain complex setup
- **Refactoring**: Refactor tests just like production code
- **Review**: Include tests in code reviews

## Coverage Requirements

### Minimum Coverage Targets
- **Overall Coverage**: 80% minimum
- **Critical Paths**: 100% coverage required
- **New Code**: 90% coverage required
- **Bug Fixes**: Must include regression tests

### Coverage Metrics
- **Line Coverage**: Percentage of lines executed
- **Branch Coverage**: Percentage of conditional branches covered
- **Function Coverage**: Percentage of functions called
- **Statement Coverage**: Percentage of statements executed

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html
```

### Coverage Exclusions
- Configuration files
- Type definitions
- Test files themselves
- Build/generated files

## Test Execution

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- TaskService.test.js

# Run E2E tests
npm run test:e2e
```

### CI/CD Integration

- All tests must pass before merging
- Run tests on every pull request
- Generate coverage reports
- Block merges if coverage drops

## Test Data Management

### Test Fixtures
Create reusable test data:
```javascript
// fixtures/tasks.js
export const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  dueDate: '2026-12-31'
};

export const mockTasks = [mockTask, /* ... */];
```

### Test Database
- Use in-memory database for integration tests
- Reset database before each test
- Seed with consistent test data

### Mock Data
- Use factories for generating test data
- Keep mock data realistic
- Avoid hardcoded IDs when possible

## Debugging Tests

### Common Issues
1. **Flaky Tests**: Investigate timing issues, use `waitFor` utilities
2. **Slow Tests**: Profile and optimize, mock external services
3. **Brittle Tests**: Reduce coupling to implementation details
4. **False Positives**: Ensure assertions are actually checking behavior

### Debugging Tools
- Jest debugger integration
- Chrome DevTools for E2E tests
- Console logging (use sparingly)
- Test.only() to isolate failing tests

## Testing Checklist

### For Every New Feature
- [ ] Unit tests for all new functions/components
- [ ] Integration tests for API interactions
- [ ] E2E tests for critical user workflows
- [ ] Tests cover success and error paths
- [ ] Tests are maintainable and well-named
- [ ] Coverage meets minimum requirements
- [ ] All tests pass locally
- [ ] Tests pass in CI/CD pipeline

### For Bug Fixes
- [ ] Create regression test that reproduces the bug
- [ ] Verify test fails before fix
- [ ] Verify test passes after fix
- [ ] Add tests for edge cases

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
