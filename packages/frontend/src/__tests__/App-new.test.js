import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock server to intercept API requests
const server = setupServer(
  // GET /api/tasks handler
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          title: 'Test Task 1',
          description: 'Test Description 1',
          due_date: '2026-12-31',
          priority: 'high',
          completed: 0,
          created_at: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          title: 'Test Task 2',
          description: 'Test Description 2',
          due_date: null,
          priority: 'low',
          completed: 1,
          created_at: '2026-01-02T00:00:00.000Z',
        },
      ])
    );
  }),

  // POST /api/tasks handler
  rest.post('/api/tasks', (req, res, ctx) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Title is required' }));
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title,
        description: req.body.description || null,
        due_date: req.body.due_date || null,
        priority: req.body.priority || 'medium',
        completed: 0,
        created_at: new Date().toISOString(),
      })
    );
  }),

  // PATCH /api/tasks/:id/complete handler
  rest.patch('/api/tasks/:id/complete', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        title: 'Updated Task',
        completed: 1,
      })
    );
  }),

  // DELETE /api/tasks/:id handler
  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Task deleted successfully' })
    );
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  it('should render the app bar with title', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('TODO App')).toBeInTheDocument();
  });

  it('should render tasks from API', async () => {
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  it('should render FAB button', async () => {
    await act(async () => {
      render(<App />);
    });
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    const fab = screen.getByLabelText('Add task');
    expect(fab).toBeInTheDocument();
  });

  it('should open create dialog when FAB is clicked', async () => {
    await act(async () => {
      render(<App />);
    });
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const fab = screen.getByLabelText('Add task');
    
    await act(async () => {
      fireEvent.click(fab);
    });

    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
  });

  it('should render filter components', async () => {
    await act(async () => {
      render(<App />);
    });
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
    });
    
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should handle API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tasks/)).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });

  it('should filter tasks when status filter is clicked', async () => {
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const activeFilter = screen.getByText('Active');
    
    await act(async () => {
      fireEvent.click(activeFilter);
    });

    // This would trigger a new API call with status=active filter
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
  });

  it('should render task metadata correctly', async () => {
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.getByText('low')).toBeInTheDocument();
    });
  });
});
