import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../components/TaskList';

describe('TaskList Component', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      priority: 'high',
      completed: 0,
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      priority: 'low',
      completed: 1,
    },
  ];

  const mockHandlers = {
    onToggleComplete: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  it('should render loading state', () => {
    render(<TaskList tasks={[]} loading={true} {...mockHandlers} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render error message', () => {
    render(
      <TaskList tasks={[]} error="Failed to load" {...mockHandlers} />
    );
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('should render empty state message', () => {
    render(<TaskList tasks={[]} {...mockHandlers} />);
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('should render list of tasks', () => {
    render(<TaskList tasks={mockTasks} {...mockHandlers} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should render correct number of tasks', () => {
    render(<TaskList tasks={mockTasks} {...mockHandlers} />);
    const tasks = screen.getAllByText(/Task \d/);
    expect(tasks).toHaveLength(2);
  });
});
