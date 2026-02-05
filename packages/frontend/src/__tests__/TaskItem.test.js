import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TaskItem from '../components/TaskItem';

describe('TaskItem Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    due_date: '2026-12-31',
    priority: 'high',
    completed: 0,
  };

  const mockHandlers = {
    onToggleComplete: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task title', () => {
    act(() => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
    });
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task description', () => {
    act(() => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
    });
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render priority chip', () => {
    act(() => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
    });
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should call onToggleComplete when checkbox is clicked', () => {
    act(() => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
    });
    const checkbox = screen.getByRole('checkbox');
    act(() => {
      fireEvent.click(checkbox);
    });
    expect(mockHandlers.onToggleComplete).toHaveBeenCalledWith(1);
  });

  it('should call onEdit when edit button is clicked', () => {
    act(() => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
    });
    const editButton = screen.getByLabelText('Edit Test Task');
    act(() => {
      fireEvent.click(editButton);
    });
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', () => {
    act(() => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
    });
    const deleteButton = screen.getByLabelText('Delete Test Task');
    act(() => {
      fireEvent.click(deleteButton);
    });
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(1);
  });

  it('should show completed style when task is completed', () => {
    const completedTask = { ...mockTask, completed: 1 };
    act(() => {
      render(<TaskItem task={completedTask} {...mockHandlers} />);
    });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should render without description', () => {
    const taskWithoutDesc = { ...mockTask, description: null };
    act(() => {
      render(<TaskItem task={taskWithoutDesc} {...mockHandlers} />);
    });
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('should render without due date', () => {
    const taskWithoutDueDate = { ...mockTask, due_date: null };
    act(() => {
      render(<TaskItem task={taskWithoutDueDate} {...mockHandlers} />);
    });
    expect(screen.queryByText(/Dec/)).not.toBeInTheDocument();
  });
});
