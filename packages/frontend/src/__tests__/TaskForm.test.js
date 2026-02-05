import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../components/TaskForm';

describe('TaskForm Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render create form when open', async () => {
    await act(async () => {
      render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    });
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('should not render when closed', async () => {
    await act(async () => {
      render(<TaskForm open={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    });
    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
  });

  it('should show edit title when editing', async () => {
    const task = { title: 'Edit Me', priority: 'medium' };
    await act(async () => {
      render(
        <TaskForm
          open={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          initialTask={task}
        />
      );
    });
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('should populate form with initial task data', async () => {
    const task = {
      title: 'Edit Me',
      description: 'Description',
      due_date: '2026-12-31',
      priority: 'high',
    };
    await act(async () => {
      render(
        <TaskForm
          open={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          initialTask={task}
        />
      );
    });
    
    expect(screen.getByDisplayValue('Edit Me')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Description')).toBeInTheDocument();
  });

  it('should show error when title is empty', async () => {
    await act(async () => {
      render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    });
    
    const submitButton = screen.getByText('Create');
    
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with form data', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    });
    
    const titleInput = screen.getByLabelText('Title *');
    await act(async () => {
      await user.type(titleInput, 'New Task');
    });
    
    const submitButton = screen.getByText('Create');
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: null,
        due_date: null,
        priority: 'medium',
      });
    });
  });

  it('should call onClose when cancel button is clicked', async () => {
    await act(async () => {
      render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    });
    
    const cancelButton = screen.getByText('Cancel');
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show character count for description', async () => {
    await act(async () => {
      render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    });
    
    expect(screen.getByText('0/500')).toBeInTheDocument();
  });

  it('should update character count when typing', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    });
    
    const descInput = screen.getByLabelText('Description');
    await act(async () => {
      await user.type(descInput, 'Test');
    });
    
    await waitFor(() => {
      expect(screen.getByText('4/500')).toBeInTheDocument();
    });
  });
});
